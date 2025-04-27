<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\UserBadge;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class BadgeController extends Controller
{
    /**
     * Devuelve las medallas asignadas al usuario para un curso dado.
     *
     * Nota: Actualmente se obtienen todas las medallas asignadas al usuario.
     * En el futuro se podrá filtrar por curso si se añade course_id a la tabla user_badges.
     */
    public function index(Request $request, $course): JsonResponse
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['error' => 'Usuario no autenticado'], 401);
        }
        
        $userBadges = UserBadge::with('badge')->where('user_id', $user->id)->get();

        return response()->json($userBadges);
    }
}
