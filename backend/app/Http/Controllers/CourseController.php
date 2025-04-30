<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;

class CourseController extends Controller
{
    public function index(): JsonResponse
    {
        $page = request()->get('page', 1);
        $courses = Cache::remember("courses_page_{$page}", now()->addMinutes(5), function () {
            return Course::select('id', 'title', 'description', 'image', 'category', 'tags', 'created_at', 'updated_at')
                         ->paginate(10);
        });

        return response()->json($courses);
    }

    public function show($id): JsonResponse
    {
        $course = Cache::remember("course_{$id}", now()->addMinutes(10), function () use ($id) {
            return Course::find($id);
        });

        if (!$course) {
            return response()->json(['error' => 'Curso no encontrado.'], 404);
        }

        return response()->json($course);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'required|string',
            'category'    => 'required|string|max:255',
            'image'       => 'required|image',
            'tags'        => 'nullable|string',
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('courses', 'public');
            $validated['image'] = '/api/public/courses/' . basename($path);
        }

        $course = Course::create($validated);

        $course->exam()->create([
            'title'       => 'Examen de ' . $course->title,
            'description' => 'Este es el examen oficial del curso.',
        ]);

        Cache::forget("courses_page_1");

        return response()->json([
            'success' => 'Curso creado exitosamente.',
            'course'  => $course,
        ], 201);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $course = Course::find($id);
        if (!$course) {
            return response()->json(['error' => 'Curso no encontrado.'], 404);
        }

        $validated = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'required|string',
            'category'    => 'required|string|max:255',
            'image'       => 'nullable|image',
            'tags'        => 'nullable|string',
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('courses', 'public');
            $validated['image'] = '/api/public/courses/' . basename($path);
        } else {
            unset($validated['image']);
        }

        $course->update($validated);
        $course->refresh();

        Cache::flush();

        return response()->json([
            'success' => 'Curso actualizado exitosamente.',
            'course'  => $course,
        ]);
    }

    public function destroy($id): JsonResponse
    {
        $course = Course::find($id);
        if (!$course) {
            return response()->json(['error' => 'Curso no encontrado.'], 404);
        }

        $course->delete();

        Cache::forget("courses_page_1");
        Cache::forget("course_{$id}");

        return response()->json(['success' => 'Curso eliminado exitosamente.']);
    }
}
