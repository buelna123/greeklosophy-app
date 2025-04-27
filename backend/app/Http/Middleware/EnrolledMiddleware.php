<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\UserCourseProgress;
use Illuminate\Support\Facades\Auth;

class EnrolledMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        // Omite la validación para el endpoint de autoinscripción
        if (preg_match('/^(api\/)?courses\/\d+\/progress\/update$/', $request->path())) {
            return $next($request);
        }

        // Extrae el parámetro "course" de la ruta y forzarlo a entero
        $courseParam = $request->route()->parameter('course');
        $courseId = intval($courseParam);
        if ($courseId === 0) {
            return response()->json(['error' => 'Parámetro de curso inválido'], 400);
        }

        $user = Auth::user();
        if (!$user) {
            return response()->json(['error' => 'Usuario no autenticado'], 401);
        }

        $isEnrolled = UserCourseProgress::where('user_id', $user->id)
                        ->where('course_id', $courseId)
                        ->exists();

        if (!$isEnrolled) {
            return response()->json(['error' => 'Acceso denegado. No estás inscrito en este curso.'], 403);
        }

        return $next($request);
    }
}