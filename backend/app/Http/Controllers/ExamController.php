<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use Illuminate\Http\JsonResponse;
use App\Models\Exam;
use App\Models\ExamQuestion;
use App\Models\ExamOption;
use App\Models\ExamResult;
use App\Models\ExamAnswer;
use App\Services\BadgeService;
use App\Http\Controllers\CourseExperienceController;

class ExamController extends Controller
{
    public function show(Request $request, $course): JsonResponse
    {
        $exam = Cache::remember("exam_course_{$course}", now()->addMinutes(10), function () use ($course) {
            return Exam::where('course_id', $course)
                ->with(['examQuestions.examOptions'])
                ->first();
        });

        if (!$exam) {
            return response()->json(['error' => 'Examen no encontrado para este curso'], 404);
        }

        $user = Auth::user();
        $submitted = false;
        $score = null;
        $passed = null;

        if ($user) {
            $result = ExamResult::where('user_id', $user->id)
                ->where('exam_id', $exam->id)
                ->first();

            if ($result) {
                $submitted = true;
                $score = $result->score;
                $passed = $result->passed;
            }
        }

        return response()->json([
            'exam' => $exam,
            'submitted' => $submitted,
            'score' => $score,
            'passed' => $passed,
        ]);
    }

    public function submit(Request $request, $course): JsonResponse
    {
        Log::info('ExamController@submit - Envío de examen', [
            'course' => $course,
            'request_data' => $request->all()
        ]);

        $user = Auth::user();
        if (!$user) {
            return response()->json(['error' => 'Usuario no autenticado'], 401);
        }

        $exam = Exam::where('course_id', $course)->first();
        if (!$exam) {
            return response()->json(['error' => 'Examen no encontrado para este curso'], 404);
        }

        $existingResult = ExamResult::where('user_id', $user->id)
            ->where('exam_id', $exam->id)
            ->exists();

        if ($existingResult) {
            return response()->json(['error' => 'El examen ya fue enviado'], 422);
        }

        $validated = $request->validate([
            'responses' => 'required|array',
            'responses.*.question_id' => 'required|integer',
            'responses.*.selected_option_id' => 'required|integer',
        ]);

        $totalScore = 0;
        $maxScore = 0;

        try {
            DB::transaction(function () use ($validated, $exam, $user, &$totalScore, &$maxScore, $course) {
                $examResult = ExamResult::create([
                    'user_id' => $user->id,
                    'exam_id' => $exam->id,
                    'score'   => 0,
                    'passed'  => false,
                ]);

                foreach ($validated['responses'] as $response) {
                    $question = ExamQuestion::find($response['question_id']);
                    if (!$question) continue;

                    $option = ExamOption::where('question_id', $question->id)
                        ->where('id', $response['selected_option_id'])
                        ->first();

                    if (!$option) continue;

                    $isCorrect = (bool)$option->is_correct;

                    ExamAnswer::create([
                        'exam_result_id' => $examResult->id,
                        'question_id' => $question->id,
                        'selected_option_id' => $option->id,
                        'is_correct' => $isCorrect,
                    ]);

                    $maxScore += $question->points;
                    if ($isCorrect) {
                        $totalScore += $question->points;
                    }
                }

                $passed = $maxScore > 0 && ($totalScore / $maxScore) >= 0.6;

                $examResult->update([
                    'score' => $totalScore,
                    'passed' => $passed,
                ]);

                BadgeService::assignBadgesAfterExam($user, $exam, $totalScore, $maxScore);
                CourseExperienceController::recalcProgress($user->id, $course);
            });

            return response()->json([
                'message' => 'Examen enviado correctamente',
                'score' => $totalScore,
                'max_score' => $maxScore,
                'passed' => $maxScore > 0 && ($totalScore / $maxScore) >= 0.6,
            ]);

        } catch (\Throwable $e) {
            Log::error('Error interno al enviar examen', [
                'mensaje' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json(['error' => 'Error interno al enviar el examen'], 500);
        }
    }

    public function submissionStatus(Request $request, $course): JsonResponse
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['error' => 'Usuario no autenticado'], 401);
        }

        $exam = Exam::where('course_id', $course)->first();
        if (!$exam) {
            return response()->json(['error' => 'Examen no encontrado para este curso'], 404);
        }

        $result = ExamResult::where('user_id', $user->id)
            ->where('exam_id', $exam->id)
            ->first();

        if (!$result) {
            return response()->json([
                'submitted' => false,
                'score' => null,
                'passed' => null,
            ]);
        }

        return response()->json([
            'submitted' => true,
            'score' => $result->score,
            'passed' => $result->passed,
        ]);
    }

    public function update(Request $request, $course): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'questions' => 'required|array',
            'questions.*.question_text' => 'required|string|max:255',
            'questions.*.points' => 'required|numeric|min:1',
            'questions.*.options' => 'required|array|min:2',
            'questions.*.options.*.option_text' => 'required|string|max:255',
            'questions.*.options.*.is_correct' => 'required',
        ]);

        $exam = Exam::where('course_id', $course)->first();
        if (!$exam) {
            return response()->json(['error' => 'Examen no encontrado para este curso'], 404);
        }

        try {
            DB::transaction(function () use ($exam, $validated, $course) {
                $exam->update([
                    'title' => $validated['title'],
                    'description' => $validated['description'] ?? '',
                ]);

                $exam->examQuestions()->each(function ($q) {
                    $q->examOptions()->delete();
                    $q->delete();
                });

                foreach ($validated['questions'] as $qData) {
                    $question = ExamQuestion::create([
                        'exam_id' => $exam->id,
                        'question_text' => $qData['question_text'],
                        'points' => $qData['points'],
                    ]);

                    foreach ($qData['options'] as $opt) {
                        ExamOption::create([
                            'question_id' => $question->id,
                            'option_text' => $opt['option_text'],
                            'is_correct' => filter_var($opt['is_correct'], FILTER_VALIDATE_BOOLEAN),
                        ]);
                    }
                }

                Cache::forget("exam_course_{$course}");
            });

            $exam->refresh()->load(['examQuestions.examOptions', 'course']);

            return response()->json([
                'success' => 'Examen actualizado correctamente',
                'exam'    => $exam,
            ]);

        } catch (\Throwable $e) {
            Log::error('Error interno al actualizar examen', [
                'mensaje' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json(['error' => 'Error interno al actualizar el examen'], 500);
        }
    }

    public function results($courseId): JsonResponse
    {
        $exam = Exam::where('course_id', $courseId)->first();
        if (!$exam) {
            return response()->json(['error' => 'Examen no encontrado'], 404);
        }

        $results = ExamResult::with(['user', 'answers.selectedOption', 'answers.question'])
            ->where('exam_id', $exam->id)
            ->orderByDesc('created_at')
            ->get()
            ->map(function ($res) use ($exam) {
                return [
                    'course_id' => $exam->course_id,
                    'user' => [
                        'id' => $res->user->id,
                        'name' => $res->user->name,
                        'email' => $res->user->email,
                    ],
                    'score' => $res->score,
                    'passed' => $res->passed,
                    'created_at' => $res->created_at,
                    'answers' => $res->answers->map(function ($a) {
                        return [
                            'question_text' => $a->question->question_text,
                            'selected_option' => $a->selectedOption->option_text ?? '(sin respuesta)',
                            'is_correct' => $a->is_correct,
                        ];
                    }),
                ];
            });

        return response()->json(['data' => $results]);
    }

    public function resultsAll(): JsonResponse
    {
        $results = ExamResult::with(['user', 'exam.course', 'answers.selectedOption', 'answers.question'])
            ->orderByDesc('created_at')
            ->get()
            ->filter(fn($res) => $res->exam) // 🔥 Evita error si falta el examen
            ->map(function ($res) {
                return [
                    'course_id' => $res->exam->course_id,
                    'user' => [
                        'id' => $res->user->id,
                        'name' => $res->user->name,
                        'email' => $res->user->email,
                    ],
                    'score' => $res->score,
                    'passed' => $res->passed,
                    'created_at' => $res->created_at,
                    'answers' => $res->answers->map(function ($a) {
                        return [
                            'question_text' => $a->question->question_text,
                            'selected_option' => $a->selectedOption->option_text ?? '(sin respuesta)',
                            'is_correct' => $a->is_correct,
                        ];
                    }),
                ];
            })
            ->values();

        return response()->json(['data' => $results]);
    }
}
