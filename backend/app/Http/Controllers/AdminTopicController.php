<?php

namespace App\Http\Controllers;

use App\Http\Requests\TopicRequest;
use App\Models\Topic;
use App\Models\QuizQuestion;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class AdminTopicController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $page     = $request->get('page', 1);
        $courseId = $request->get('course_id');
        $cacheKey = $courseId
            ? "admin_topics_course_{$courseId}_page_{$page}"
            : "admin_topics_page_{$page}";

        $topics = Cache::remember($cacheKey, now()->addMinutes(5), function () use ($courseId) {
            $query = Topic::select('id', 'course_id', 'title', 'content', 'created_at', 'updated_at')
                          ->latest('created_at');
            if ($courseId) {
                $query->where('course_id', $courseId);
            }
            return $query->paginate(10);
        });

        return response()->json($topics);
    }

    public function show(int $id): JsonResponse
    {
        $cacheKey = "admin_topic_{$id}";
        $topic = Cache::remember($cacheKey, now()->addMinutes(10), function () use ($id) {
            return Topic::select('id', 'course_id', 'title', 'content', 'created_at', 'updated_at')
                        ->find($id);
        });

        if (! $topic) {
            return response()->json(['error' => 'Topic no encontrado'], 404);
        }

        return response()->json($topic);
    }

    public function store(TopicRequest $request): JsonResponse
    {
        $validated = $request->validated();

        try {
            $topic = DB::transaction(function () use ($validated) {
                $topic = Topic::create($validated);

                // Crear una pregunta dummy automáticamente
                QuizQuestion::create([
                    'topic_id' => $topic->id,
                    'question_text' => 'Placeholder: edita esta pregunta',
                    'points' => 1,
                ]);

                return $topic;
            });

            Cache::forget("admin_topics_page_1");
            Cache::forget("admin_topics_course_{$validated['course_id']}_page_1");
            Cache::forget("topics_course_{$validated['course_id']}");

            return response()->json([
                'success' => 'Topic y quiz creados exitosamente.',
                'topic'   => $topic,
            ], 201);
        } catch (\Exception $e) {
            Log::error("Error al crear topic desde admin: " . $e->getMessage());
            return response()->json(['error' => 'Error al crear el topic.'], 500);
        }
    }

    public function update(TopicRequest $request, int $id): JsonResponse
    {
        $topic = Topic::find($id);
        if (! $topic) {
            return response()->json(['error' => 'Topic no encontrado'], 404);
        }

        $validated = $request->validated();
        $topic->update($validated);
        $topic->refresh();

        Cache::forget("admin_topic_{$id}");
        Cache::forget("admin_topics_page_1");
        Cache::forget("admin_topics_course_{$topic->course_id}_page_1");
        Cache::forget("topics_course_{$topic->course_id}");

        return response()->json([
            'success' => 'Topic actualizado exitosamente.',
            'topic'   => $topic,
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $topic = Topic::find($id);
        if (! $topic) {
            return response()->json(['error' => 'Topic no encontrado'], 404);
        }

        $courseId = $topic->course_id;
        $topic->delete();

        Cache::forget("admin_topics_page_1");
        Cache::forget("admin_topics_course_{$courseId}_page_1");
        Cache::forget("admin_topic_{$id}");
        Cache::forget("topics_course_{$courseId}");

        return response()->json(['success' => 'Topic eliminado exitosamente.']);
    }
}
