<?php

namespace App\Http\Controllers;

use App\Models\Article;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class ArticleController extends Controller
{
    public function index(): JsonResponse
    {
        $page = request()->get('page', 1);
        $articles = Cache::remember("articles_page_{$page}", now()->addMinutes(5), function () {
            return Article::select('id', 'title', 'content', 'author', 'image', 'category', 'tags', 'created_at', 'updated_at')
                           ->paginate(10);
        });

        return response()->json($articles);
    }

    public function show($id): JsonResponse
    {
        $article = Cache::remember("article_detail_{$id}", now()->addMinutes(10), function () use ($id) {
            return Article::select('id', 'title', 'content', 'author', 'image', 'category', 'tags', 'created_at', 'updated_at')
                           ->find($id);
        });

        if (!$article) {
            return response()->json(['error' => 'Artículo no encontrado'], 404);
        }

        return response()->json($article);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title'    => 'required|string|max:255',
            'content'  => 'required|string',
            'author'   => 'required|string|max:255',
            // Usamos created_at por defecto; no se envía manualmente
            'category' => 'required|string|max:255',
            'image'    => 'required|image',
            'tags'     => 'nullable|string',
        ]);

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            // Se almacena en el disco "public" en la carpeta "articles"
            $filePath = $file->store('articles', 'public');
            $validated['image'] = $filePath;
        }

        $article = Article::create($validated);

        Cache::forget("articles_page_1");

        return response()->json([
            'success' => 'Artículo creado exitosamente.',
            'article' => $article,
        ], 201);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $article = Article::find($id);
        if (!$article) {
            return response()->json(['error' => 'Artículo no encontrado'], 404);
        }

        $validated = $request->validate([
            'title'    => 'required|string|max:255',
            'content'  => 'required|string',
            'author'   => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'image'    => 'nullable|image',
            'tags'     => 'nullable|string',
        ]);

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $filePath = $file->store('articles', 'public');
            $validated['image'] = $filePath;
        } else {
            unset($validated['image']);
        }

        $article->update($validated);
        $article->refresh();

        Cache::flush();

        return response()->json([
            'success' => 'Artículo actualizado exitosamente.',
            'article' => $article,
        ]);
    }

    public function destroy($id): JsonResponse
    {
        $article = Article::find($id);
        if (!$article) {
            return response()->json(['error' => 'Artículo no encontrado'], 404);
        }

        $article->delete();

        Cache::forget("articles_page_1");

        return response()->json(['success' => 'Artículo eliminado exitosamente.']);
    }

    public function authors(): JsonResponse
    {
        $authors = DB::table('articles')
            ->select('author')
            ->distinct()
            ->whereNotNull('author')
            ->orderBy('author')
            ->pluck('author');

        return response()->json($authors);
    }

    public function categories(): JsonResponse
    {
        $categories = DB::table('articles')
            ->select('category')
            ->distinct()
            ->whereNotNull('category')
            ->orderBy('category')
            ->pluck('category');

        return response()->json($categories);
    }
}
