<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\AssignmentSubmission;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\CourseExperienceController;

class AssignmentReviewController extends Controller
{
    /**
     * Lista todas las entregas (de cualquier asignación) para revisión.
     */
    public function index(): JsonResponse
    {
        $submissions = AssignmentSubmission::with(['user', 'assignment.course'])
            ->latest()
            ->get()
            ->map(function ($submission) {
                return [
                    'id' => $submission->id,
                    'assignment_id' => $submission->assignment_id,
                    'user_name' => $submission->user->name,
                    'course_name' => $submission->assignment->course->title,
                    'submitted_at' => $submission->submitted_at,
                    'grade' => $submission->grade,
                    'review_comment' => $submission->review_comment,
                    'file_path' => $submission->file_path,
                ];
            });

        return response()->json([
            'submissions' => $submissions
        ]);
    }

    /**
     * Guarda la retroalimentación (grade y comentario) para una entrega específica.
     */
    public function feedback(Request $request, int $submissionId): JsonResponse
    {
        $validated = $request->validate([
            'grade'          => 'required|integer|min:0|max:100',
            'review_comment' => 'nullable|string',
        ]);

        Log::info('AssignmentReviewController@feedback invoked', [
            'submission_id'  => $submissionId,
            'grade'          => $validated['grade'],
        ]);

        $submission = AssignmentSubmission::with('assignment')->find($submissionId);

        if (! $submission) {
            return response()->json(['error' => 'Entrega no encontrada'], 404);
        }

        $submission->grade = $validated['grade'];
        $submission->review_comment = $validated['review_comment'] ?? null;
        $submission->graded_at = now();
        $submission->save();

        Log::info('AssignmentReviewController@feedback - Entrega calificada', [
            'submission_id' => $submission->id,
            'grade'         => $submission->grade,
        ]);

        // Recalcular progreso del curso
        $courseId = $submission->assignment->course_id;
        CourseExperienceController::recalcProgress($submission->user_id, $courseId);

        return response()->json([
            'success'    => 'Retroalimentación guardada exitosamente.',
            'submission' => $submission->load('user')
        ]);
    }
}
