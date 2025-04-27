<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Article;
use App\Models\Course;
use Illuminate\Support\Facades\Cache;

class SearchController extends Controller
{
    public function search(Request $request)
    {
        $query = $request->input('query');
        $cacheKey = "search_" . md5($query);

        $results = Cache::remember($cacheKey, now()->addMinutes(5), function() use ($query) {
            $articles = Article::where('title', 'like', "%{$query}%")
                ->orWhere('content', 'like', "%{$query}%")
                ->orWhere('author', 'like', "%{$query}%")
                ->get()
                ->map(function ($article) {
                    return [
                        'id' => $article->id,
                        'title' => $article->title,
                        'type' => 'article'
                    ];
                });

            $courses = Course::where('title', 'like', "%{$query}%")
                ->orWhere('description', 'like', "%{$query}%")
                ->orWhere('category', 'like', "%{$query}%")
                ->get()
                ->map(function ($course) {
                    return [
                        'id' => $course->id,
                        'title' => $course->title,
                        'type' => 'course'
                    ];
                });

            return $articles->merge($courses);
        });

        return response()->json($results);
    }
}
