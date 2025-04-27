<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\JsonResponse;
use App\Models\QuizQuestion;
use App\Models\QuizOption;
use App\Models\QuizResult;
use App\Models\Topic;
use App\Http\Controllers\CourseExperienceController;

class QuizController extends Controller
{
    public function show(Request $request, $course, $topic): JsonResponse
    {
        $quizQuestions = Cache::remember("quiz_topic_{$topic}", now()->addMinutes(10), function () use ($topic) {
            return QuizQuestion::where('topic_id', $topic)
                ->with('quizOptions')
                ->get();
        });

        if ($quizQuestions->isEmpty()) {
            return response()->json([
                'quizQuestions' => [],
                'submitted' => false,
                'total_score' => null
            ]);
        }

        $submitted = false;
        $totalScore = null;
        $user = Auth::user();

        if ($user) {
            $questionIds = $quizQuestions->pluck('id');
            $answeredCount = QuizResult::where('user_id', $user->id)
                ->whereIn('quiz_question_id', $questionIds)
                ->distinct('quiz_question_id')
                ->count();

            $submitted = $answeredCount >= $quizQuestions->count();

            if ($submitted) {
                $totalScore = QuizResult::where('user_id', $user->id)
                    ->whereIn('quiz_question_id', $questionIds)
                    ->sum('score');
            }
        }

        return response()->json([
            'quizQuestions' => $quizQuestions,
            'submitted'     => $submitted,
            'total_score'   => $totalScore,
        ]);
    }

    public function submit(Request $request, $course, $topic): JsonResponse
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['error' => 'Usuario no autenticado'], 401);
        }

        $quizQuestions = QuizQuestion::where('topic_id', $topic)->get();
        if ($quizQuestions->isEmpty()) {
            return response()->json(['error' => 'No hay preguntas de quiz para este tema'], 404);
        }

        $validated = $request->validate([
            'responses' => 'required|array',
            'responses.*.question_id' => 'required|integer',
            'responses.*.selected_option_id' => 'required|integer',
        ]);

        $totalScore = 0;

        foreach ($validated['responses'] as $response) {
            $question = QuizQuestion::find($response['question_id']);
            if (!$question) continue;

            $option = QuizOption::where('question_id', $question->id)
                ->find($response['selected_option_id']);

            $isCorrect = $option ? (bool) $option->is_correct : false;
            $score = $isCorrect ? $question->points : 0;
            $totalScore += $score;

            QuizResult::create([
                'user_id'            => $user->id,
                'quiz_question_id'   => $question->id,
                'selected_option_id' => $response['selected_option_id'],
                'is_correct'         => $isCorrect,
                'score'              => $score,
            ]);
        }

        CourseExperienceController::recalcProgress($user->id, $course);

        return response()->json(['total_score' => $totalScore]);
    }

    public function getAllByCourse(Request $request, $course): JsonResponse
    {
        try {
            $topics = Topic::where('course_id', $course)
                ->with(['quizQuestions.quizOptions'])
                ->get();

            $user = Auth::user();

            $data = $topics->map(function ($topic) use ($user) {
                $questions = $topic->quizQuestions ?? collect();

                $questions = $questions->filter(fn($q) => $q->quizOptions && $q->quizOptions->count() > 0)->values();

                $questions = $questions->map(function ($question) {
                    $question->quizOptions = $question->quizOptions ?? collect();
                    $question->quizOptions->transform(fn($opt) => [
                        'id' => $opt->id,
                        'option_text' => $opt->option_text,
                        'is_correct' => (bool) $opt->is_correct,
                    ]);

                    return [
                        'id' => $question->id,
                        'question_text' => $question->question_text,
                        'points' => (int) $question->points,
                        'quizOptions' => $question->quizOptions,
                    ];
                });

                $submitted = false;
                $score = null;

                if ($user && $questions->count() > 0) {
                    $questionIds = $questions->pluck('id');
                    $answeredCount = QuizResult::where('user_id', $user->id)
                        ->whereIn('quiz_question_id', $questionIds)
                        ->distinct('quiz_question_id')
                        ->count();

                    $submitted = $answeredCount >= $questions->count();

                    if ($submitted) {
                        $score = QuizResult::where('user_id', $user->id)
                            ->whereIn('quiz_question_id', $questionIds)
                            ->sum('score');
                    }
                }

                return [
                    'topic_id' => $topic->id,
                    'topic_title' => $topic->title,
                    'submitted' => $submitted,
                    'total_score' => $score,
                    'quizQuestions' => $questions,
                ];
            });

            return response()->json(['quizzes' => $data ?? []]);
        } catch (\Throwable $e) {
            Log::error('Error en getAllByCourse', [
                'mensaje' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['quizzes' => [], 'error' => 'Error interno al cargar quizzes.'], 200);
        }
    }

    public function update(Request $request, $topic): JsonResponse
    {
        Log::info('Recibido para update quiz', [
            'topic' => $topic,
            'payload' => $request->all()
        ]);

        $validated = $request->validate([
            'questions' => 'required|array',
            'questions.*.question_text' => 'required|string|max:255',
            'questions.*.points' => 'required|numeric|min:1',
            'questions.*.options' => 'required|array|min:2',
            'questions.*.options.*.option_text' => 'required|string|max:255',
            'questions.*.options.*.is_correct' => 'required',
        ]);

        try {
            DB::transaction(function () use ($topic, $validated) {
                QuizQuestion::where('topic_id', $topic)->each(function ($question) {
                    $question->quizOptions()->delete();
                    $question->delete();
                });

                foreach ($validated['questions'] as $qData) {
                    $question = QuizQuestion::create([
                        'topic_id' => $topic,
                        'question_text' => $qData['question_text'],
                        'points' => (int) $qData['points'],
                    ]);

                    foreach ($qData['options'] as $opt) {
                        QuizOption::create([
                            'question_id' => $question->id,
                            'option_text' => $opt['option_text'],
                            'is_correct' => filter_var($opt['is_correct'], FILTER_VALIDATE_BOOLEAN),
                        ]);
                    }
                }

                Cache::forget("quiz_topic_{$topic}");
            });

            return response()->json(['success' => 'Quiz actualizado correctamente']);
        } catch (\Throwable $e) {
            Log::error('Error al actualizar quiz', [
                'mensaje' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'payload' => $request->all()
            ]);
            return response()->json(['error' => 'Error interno al actualizar quiz'], 500);
        }
    }
}
