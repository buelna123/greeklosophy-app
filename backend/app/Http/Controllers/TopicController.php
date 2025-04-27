<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Models\Topic;
use App\Models\QuizQuestion;

class TopicController extends Controller
{
    public function index(Request $request, $course): JsonResponse
    {
        $topics = Cache::remember("topics_course_{$course}", now()->addMinutes(10), function () use ($course) {
            return Topic::where('course_id', $course)
                ->latest('created_at')
                ->get();
        });

        return response()->json($topics);
    }

    public function show(Request $request, $course, $topic): JsonResponse
    {
        $topicModel = Cache::remember("topic_{$topic}_course_{$course}", now()->addMinutes(10), function () use ($course, $topic) {
            return Topic::where('course_id', $course)
                ->where('id', $topic)
                ->with(['quizQuestions.quizOptions'])
                ->first();
        });

        if (!$topicModel) {
            return response()->json(['error' => 'Tema no encontrado.'], 404);
        }

        return response()->json($topicModel);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'nullable|string',
            'course_id' => 'required|integer|exists:courses,id',
        ]);

        try {
            $topic = DB::transaction(function () use ($validated) {
                $topic = Topic::create($validated);

                // Crea automáticamente un quiz vacío para este topic
                // No creamos preguntas aquí, solo se genera el contenedor para el frontend
                QuizQuestion::create([
                    'topic_id' => $topic->id,
                    'question_text' => 'Placeholder: edita esta pregunta',
                    'points' => 1,
                ]);

                return $topic;
            });

            // Limpiar cache del curso
            Cache::forget("topics_course_{$validated['course_id']}");

            return response()->json([
                'success' => 'Tema y quiz creados correctamente.',
                'topic' => $topic
            ]);
        } catch (\Exception $e) {
            Log::error("Error al crear tema: " . $e->getMessage());
            return response()->json(['error' => 'Error interno al crear el tema.'], 500);
        }
    }
}
