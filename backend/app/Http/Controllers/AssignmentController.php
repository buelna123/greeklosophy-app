<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\JsonResponse;
use App\Models\Assignment;
use App\Models\AssignmentSubmission;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\CourseExperienceController;

class AssignmentController extends Controller
{
    public function index(Request $request, $course): JsonResponse
    {
        $assignments = Assignment::where('course_id', $course)->get();
        return response()->json($assignments);
    }

    public function show(Request $request, $course, $assignment): JsonResponse
    {
        $assignmentModel = Assignment::where('course_id', $course)
            ->where('id', $assignment)
            ->first();

        if (!$assignmentModel) {
            return response()->json(['error' => 'Asignación no encontrada'], 404);
        }

        return response()->json($assignmentModel);
    }

    public function submit(Request $request, $course, $assignment): JsonResponse
    {
        Log::info('AssignmentController@submit invoked', [
            'course' => $course,
            'assignment' => $assignment,
        ]);

        if (!$request->hasFile('file')) {
            return response()->json([
                'error' => 'El archivo es obligatorio y debe enviarse como multipart/form-data'
            ], 422);
        }

        $validated = $request->validate([
            'file' => 'required|file|max:10240'
        ]);

        $assignmentModel = Assignment::where('course_id', $course)
            ->where('id', $assignment)
            ->first();

        if (!$assignmentModel) {
            return response()->json(['error' => 'Asignación no encontrada'], 404);
        }

        $user = Auth::user();
        if (!$user) {
            return response()->json(['error' => 'Usuario no autenticado'], 401);
        }

        $existingSubmission = AssignmentSubmission::where('assignment_id', $assignmentModel->id)
            ->where('user_id', $user->id)
            ->first();

        $path = $request->file('file')->store('assignments', 'public');
        $urlPath = '/api/public/assignments/' . basename($path);

        if ($existingSubmission) {
            $existingSubmission->update([
                'file_path' => $urlPath,
                'submitted_at' => now(),
            ]);

            CourseExperienceController::recalcProgress($user->id, $course);

            return response()->json([
                'message'    => 'Tarea actualizada exitosamente',
                'submission' => $existingSubmission
            ]);
        } else {
            $submission = AssignmentSubmission::create([
                'assignment_id' => $assignmentModel->id,
                'user_id'       => $user->id,
                'file_path'     => $urlPath,
                'grade'         => null,
                'review_comment'=> null,
                'submitted_at'  => now(),
            ]);

            CourseExperienceController::recalcProgress($user->id, $course);

            return response()->json([
                'message'    => 'Tarea entregada exitosamente',
                'submission' => $submission
            ]);
        }
    }

    public function gradeAssignment(Request $request, $course, $assignment, $submissionId): JsonResponse
    {
        Log::info('AssignmentController@gradeAssignment invoked', [
            'course'      => $course,
            'assignment'  => $assignment,
            'submissionId'=> $submissionId,
        ]);

        $validated = $request->validate([
            'grade' => 'required|integer|min:0|max:100',
            'review_comment' => 'nullable|string'
        ]);

        $submission = AssignmentSubmission::where('id', $submissionId)
            ->where('assignment_id', $assignment)
            ->first();

        if (!$submission) {
            return response()->json(['error' => 'Entrega no encontrada'], 404);
        }

        $submission->update([
            'grade'         => $validated['grade'],
            'review_comment'=> $validated['review_comment'],
            'graded_at'     => now(),
        ]);

        return response()->json([
            'message'    => 'Tarea calificada exitosamente',
            'submission' => $submission
        ]);
    }

    public function submissionStatus(Request $request, $course, $assignment): JsonResponse
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['error' => 'Usuario no autenticado'], 401);
        }

        $assignmentModel = Assignment::where('course_id', $course)
            ->where('id', $assignment)
            ->first();

        if (!$assignmentModel) {
            return response()->json(['error' => 'Asignación no encontrada'], 404);
        }

        $existingSubmission = AssignmentSubmission::where('assignment_id', $assignmentModel->id)
            ->where('user_id', $user->id)
            ->first();

        return response()->json([
            'submitted' => $existingSubmission ? true : false
        ]);
    }
}
