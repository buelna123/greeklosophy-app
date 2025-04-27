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
    /**
     * Lista todas las asignaciones de un curso.
     */
    public function index(Request $request, $course): JsonResponse
    {
        $assignments = Assignment::where('course_id', $course)->get();
        return response()->json($assignments);
    }
    
    /**
     * Devuelve los datos de una asignación específica.
     */
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

    /**
     * Registra o actualiza la entrega de una tarea para un assignment específico.
     * Se espera que se envíe un archivo en el campo 'file' mediante multipart/form-data.
     */
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

        // Se busca una entrega existente para este usuario y asignación
        $existingSubmission = AssignmentSubmission::where('assignment_id', $assignmentModel->id)
            ->where('user_id', $user->id)
            ->first();

        $filePath = $request->file('file')->store('assignments', 'public');

        if ($existingSubmission) {
            // Se actualiza la entrega existente
            $existingSubmission->update([
                'file_path' => $filePath,
                'submitted_at' => now(),
            ]);

            Log::info('AssignmentController@submit - Tarea actualizada', [
                'user_id' => $user->id,
                'assignment_id' => $assignmentModel->id,
                'file_path' => $filePath,
            ]);

            // Se actualiza el progreso del curso de manera inmediata
            CourseExperienceController::recalcProgress($user->id, $course);

            return response()->json([
                'message'    => 'Tarea actualizada exitosamente',
                'submission' => $existingSubmission
            ]);
        } else {
            // Se crea un nuevo registro de entrega
            $submission = AssignmentSubmission::create([
                'assignment_id' => $assignmentModel->id,
                'user_id'       => $user->id,
                'file_path'     => $filePath,
                'grade'         => null,
                'review_comment'=> null,
                'submitted_at'  => now(),
            ]);

            Log::info('AssignmentController@submit - Tarea entregada', [
                'user_id'       => $user->id,
                'assignment_id' => $assignmentModel->id,
                'file_path'     => $filePath,
            ]);

            // Se actualiza el progreso del curso de manera inmediata
            CourseExperienceController::recalcProgress($user->id, $course);

            return response()->json([
                'message'    => 'Tarea entregada exitosamente',
                'submission' => $submission
            ]);
        }
    }

    /**
     * Permite calificar la entrega de una tarea.
     */
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

        $submission->grade = $validated['grade'];
        $submission->review_comment = $validated['review_comment'] ?? null;
        $submission->graded_at = now();
        $submission->save();

        Log::info('AssignmentController@gradeAssignment - Tarea calificada', [
            'submissionId' => $submissionId,
            'grade'        => $validated['grade']
        ]);

        return response()->json([
            'message'    => 'Tarea calificada exitosamente',
            'submission' => $submission
        ]);
    }

    /**
     * Devuelve el estado de entrega de una tarea para un assignment específico.
     * Retorna { "submitted": true } si el usuario ya entregó la tarea, o false en caso contrario.
     */
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
