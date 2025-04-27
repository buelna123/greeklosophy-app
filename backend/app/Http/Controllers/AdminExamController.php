<?php

namespace App\Http\Controllers;

use App\Models\Exam;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class AdminExamController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $page     = $request->get('page', 1);
        $courseId = $request->get('course_id');
        $cacheKey = "admin_exams_page_{$page}" . ($courseId ? "_course_{$courseId}" : '');

        $exams = Cache::remember($cacheKey, now()->addMinutes(5), function () use ($courseId) {
            $query = Exam::with(['examQuestions.examOptions', 'course'])
                         ->orderBy('created_at', 'desc');

            if ($courseId) {
                $query->where('course_id', $courseId);
            }

            return $query->get(); // full list
        });

        return response()->json(['data' => $exams]);
    }

    public function show(int $id): JsonResponse
    {
        $cacheKey = "admin_exam_{$id}";
        $exam = Cache::remember($cacheKey, now()->addMinutes(10), function () use ($id) {
            return Exam::with(['examQuestions.examOptions', 'course'])->find($id);
        });

        if (!$exam) {
            return response()->json(['error' => 'Examen no encontrado'], 404);
        }

        return response()->json($exam);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $exam = Exam::find($id);
        if (!$exam) {
            return response()->json(['error' => 'Examen no encontrado'], 404);
        }

        $exam->update($validated);
        $exam->refresh()->load(['examQuestions.examOptions', 'course']);

        Cache::forget("admin_exam_{$id}");
        Cache::forget("admin_exams_page_1");
        Cache::forget("admin_exams_page_1_course_{$exam->course_id}");

        return response()->json([
            'success' => 'Examen actualizado exitosamente.',
            'exam'    => $exam,
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $exam = Exam::find($id);
        if (!$exam) {
            return response()->json(['error' => 'Examen no encontrado'], 404);
        }

        $courseId = $exam->course_id;
        $exam->delete();

        Cache::forget("admin_exam_{$id}");
        Cache::forget("admin_exams_page_1");
        Cache::forget("admin_exams_page_1_course_{$courseId}");

        return response()->json(['success' => 'Examen eliminado exitosamente.']);
    }
}
