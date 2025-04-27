<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\UserCourseProgress;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class CourseExperienceController extends Controller
{
    public function getProgress(Request $request, $course): JsonResponse
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['error' => 'Usuario no autenticado'], 401);
        }

        $cacheKey = "progress_user_{$user->id}_course_{$course}";
        $progress = Cache::remember($cacheKey, now()->addMinutes(5), function () use ($user, $course) {
            return UserCourseProgress::where('user_id', $user->id)
                ->where('course_id', $course)
                ->first();
        });

        if (!$progress) {
            self::recalcProgress($user->id, $course);
            $progress = UserCourseProgress::where('user_id', $user->id)
                ->where('course_id', $course)
                ->first();

            if (!$progress) {
                return response()->json(['message' => 'Progreso no encontrado.'], 404);
            }
        }

        return response()->json($progress);
    }

    public function updateProgress(Request $request, $course): JsonResponse
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['error' => 'Usuario no autenticado'], 401);
        }

        $validated = $request->validate([
            'progress'    => 'required|numeric|min:0|max:100',
            'final_grade' => 'nullable|numeric|min:0|max:100',
        ]);

        $progress = UserCourseProgress::firstOrNew([
            'user_id'   => $user->id,
            'course_id' => $course,
        ]);

        if ($progress->exists && $progress->progress > 0) {
            return response()->json([
                'message' => 'El usuario ya está inscrito y el progreso se ha establecido previamente.',
                'data'    => $progress
            ]);
        }

        $progress->progress = $validated['progress'];
        if (isset($validated['final_grade'])) {
            $progress->final_grade = $validated['final_grade'];
        }
        $progress->save();

        Cache::forget("progress_user_{$user->id}_course_{$course}");

        return response()->json([
            'message' => 'Progreso actualizado correctamente',
            'data'    => $progress
        ]);
    }

    public static function recalcProgress($userId, $courseId)
    {
        // Verificar si se entregó la tarea
        $assignmentSubmitted = DB::table('assignment_submissions')
            ->join('assignments', 'assignment_submissions.assignment_id', '=', 'assignments.id')
            ->where('assignments.course_id', $courseId)
            ->where('assignment_submissions.user_id', $userId)
            ->exists();

        // Verificar si se envió el examen
        $examSubmitted = DB::table('exam_results')
            ->join('exams', 'exam_results.exam_id', '=', 'exams.id')
            ->where('exams.course_id', $courseId)
            ->where('exam_results.user_id', $userId)
            ->exists();

        // Verificar los quizzes completados por topic
        $topicIds = DB::table('topics')
            ->where('course_id', $courseId)
            ->pluck('id');

        $totalTopicsWithQuizzes = 0;
        $completedTopics = 0;

        foreach ($topicIds as $topicId) {
            $quizQuestionIds = DB::table('quiz_questions')
                ->where('topic_id', $topicId)
                ->pluck('id');

            if ($quizQuestionIds->isEmpty()) continue;

            $totalTopicsWithQuizzes++;

            $answeredCount = DB::table('quiz_results')
                ->where('user_id', $userId)
                ->whereIn('quiz_question_id', $quizQuestionIds)
                ->distinct('quiz_question_id')
                ->count('quiz_question_id');

            if ($answeredCount >= $quizQuestionIds->count()) {
                $completedTopics++;
            }
        }

        $quizProgress = $totalTopicsWithQuizzes > 0
            ? ($completedTopics / $totalTopicsWithQuizzes)
            : 0;

        // Distribución proporcional del progreso
        $quizWeight = 33.33;
        $assignmentWeight = 33.33;
        $examWeight = 33.34;

        $progressPercent =
            ($quizProgress * $quizWeight) +
            ($assignmentSubmitted ? $assignmentWeight : 0) +
            ($examSubmitted ? $examWeight : 0);

        $progress = UserCourseProgress::firstOrNew([
            'user_id'   => $userId,
            'course_id' => $courseId,
        ]);

        $progress->progress = round($progressPercent, 2);
        $progress->save();

        Cache::forget("progress_user_{$userId}_course_{$courseId}");
    }
}
