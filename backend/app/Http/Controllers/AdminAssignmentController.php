<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\AssignmentRequest;
use App\Models\Assignment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class AdminAssignmentController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $page     = $request->get('page', 1);
        $courseId = $request->get('course_id');

        $cacheKey = "admin_assignments_page_{$page}"
            . ($courseId ? "_course_{$courseId}" : '');

        $assignments = Cache::remember($cacheKey, now()->addMinutes(5), function () use ($courseId) {
            $query = Assignment::query()
                ->select('id', 'course_id', 'title', 'description', 'due_date', 'created_at', 'updated_at')
                ->orderBy('due_date', 'asc');

            if ($courseId) {
                $query->where('course_id', $courseId);
            }

            return $query->paginate(10);
        });

        return response()->json($assignments);
    }

    public function show(int $id): JsonResponse
    {
        $cacheKey = "admin_assignment_{$id}";
        $assignment = Cache::remember($cacheKey, now()->addMinutes(10), fn () =>
            Assignment::find($id)
        );

        if (! $assignment) {
            return response()->json(['error' => 'Assignment no encontrado'], 404);
        }

        return response()->json($assignment);
    }

    public function store(AssignmentRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $assignment = Assignment::create($validated);

        Cache::forget("admin_assignments_page_1");
        Cache::forget("admin_assignments_page_1_course_{$validated['course_id']}");

        return response()->json([
            'success'    => 'Assignment creado exitosamente.',
            'assignment' => $assignment,
        ], 201);
    }

    public function update(AssignmentRequest $request, int $id): JsonResponse
    {
        $assignment = Assignment::find($id);
        if (! $assignment) {
            return response()->json(['error' => 'Assignment no encontrado'], 404);
        }

        $validated = $request->validated();
        $assignment->update($validated);
        $assignment->refresh();

        Cache::forget("admin_assignment_{$id}");
        Cache::forget("admin_assignments_page_1");
        Cache::forget("admin_assignments_page_1_course_{$assignment->course_id}");

        return response()->json([
            'success'    => 'Assignment actualizado exitosamente.',
            'assignment' => $assignment,
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $assignment = Assignment::find($id);
        if (! $assignment) {
            return response()->json(['error' => 'Assignment no encontrado'], 404);
        }

        $courseId = $assignment->course_id;
        $assignment->delete();

        Cache::forget("admin_assignment_{$id}");
        Cache::forget("admin_assignments_page_1");
        Cache::forget("admin_assignments_page_1_course_{$courseId}");

        return response()->json(['success' => 'Assignment eliminado exitosamente.']);
    }
}
