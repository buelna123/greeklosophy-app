<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\QuizRequest;
use App\Models\QuizQuestion;
use App\Models\QuizOption;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class AdminQuizController extends Controller
{
    /**
     * Lista paginada de quizzes (preguntas de quiz), opcionalmente filtrada por topic_id.
     */
    public function index(Request $request): JsonResponse
    {
        $page    = $request->get('page', 1);
        $topicId = $request->get('topic_id');
        $cacheKey = "admin_quizzes_page_{$page}" . ($topicId ? "_topic_{$topicId}" : '');

        $quizzes = Cache::remember($cacheKey, now()->addMinutes(5), function () use ($topicId) {
            $query = QuizQuestion::withCount('quizOptions')->select('id', 'topic_id', 'question_text', 'points');
            if ($topicId) {
                $query->where('topic_id', $topicId);
            }
            return $query->paginate(10);
        });

        return response()->json($quizzes);
    }

    /**
     * Muestra un quiz (pregunta) con sus opciones.
     */
    public function show(int $id): JsonResponse
    {
        $cacheKey = "admin_quiz_{$id}";
        $quiz = Cache::remember($cacheKey, now()->addMinutes(10), function () use ($id) {
            return QuizQuestion::with('quizOptions')->find($id);
        });

        if (! $quiz) {
            return response()->json(['error' => 'Quiz no encontrado'], 404);
        }

        return response()->json($quiz);
    }

    /**
     * Crea una nueva pregunta de quiz y sus opciones.
     */
    public function store(QuizRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $quiz = DB::transaction(function () use ($validated) {
            $question = QuizQuestion::create([
                'topic_id'     => $validated['topic_id'],
                'question_text'=> $validated['question_text'],
                'points'       => $validated['points'],
            ]);
            foreach ($validated['options'] as $opt) {
                $question->quizOptions()->create([
                    'option_text' => $opt['option_text'],
                    'is_correct'  => $opt['is_correct'],
                ]);
            }
            return $question->load('quizOptions');
        });

        // Limpiar caches
        Cache::forget("admin_quizzes_page_1");
        if (isset($validated['topic_id'])) {
            Cache::forget("admin_quizzes_page_1_topic_{$validated['topic_id']}");
        }

        return response()->json([
            'success' => 'Quiz creado exitosamente.',
            'quiz'    => $quiz,
        ], 201);
    }

    /**
     * Actualiza una pregunta de quiz y sus opciones.
     */
    public function update(QuizRequest $request, int $id): JsonResponse
    {
        $quiz = QuizQuestion::find($id);
        if (! $quiz) {
            return response()->json(['error' => 'Quiz no encontrado'], 404);
        }

        $validated = $request->validated();

        $updated = DB::transaction(function () use ($quiz, $validated) {
            $quiz->update([
                'topic_id'     => $validated['topic_id'],
                'question_text'=> $validated['question_text'],
                'points'       => $validated['points'],
            ]);
            // Reemplazar opciones: eliminamos y recreamos
            $quiz->quizOptions()->delete();
            foreach ($validated['options'] as $opt) {
                $quiz->quizOptions()->create([
                    'option_text' => $opt['option_text'],
                    'is_correct'  => $opt['is_correct'],
                ]);
            }
            return $quiz->load('quizOptions');
        });

        // Limpiar caches
        Cache::forget("admin_quiz_{$id}");
        Cache::forget("admin_quizzes_page_1");
        Cache::forget("admin_quizzes_page_1_topic_{$quiz->topic_id}");

        return response()->json([
            'success' => 'Quiz actualizado exitosamente.',
            'quiz'    => $updated,
        ]);
    }

    /**
     * Elimina una pregunta de quiz (y sus opciones por cascade).
     */
    public function destroy(int $id): JsonResponse
    {
        $quiz = QuizQuestion::find($id);
        if (! $quiz) {
            return response()->json(['error' => 'Quiz no encontrado'], 404);
        }

        $topicId = $quiz->topic_id;
        $quiz->delete();

        // Limpiar caches
        Cache::forget("admin_quiz_{$id}");
        Cache::forget("admin_quizzes_page_1");
        Cache::forget("admin_quizzes_page_1_topic_{$topicId}");

        return response()->json(['success' => 'Quiz eliminado exitosamente.']);
    }
}
