<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Cache;

class UserController extends Controller
{
    public function index(): JsonResponse
    {
        $page = request()->get('page', 1);
        $users = Cache::remember("users_page_{$page}", now()->addMinutes(5), function () {
            return User::select('id', 'name', 'email', 'role', 'fecha_registro', 'status')
                       ->paginate(10);
        });

        return response()->json($users);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'role'     => 'required|in:admin,student',
        ]);

        $validated['password'] = Hash::make($validated['password']);

        $user = User::create($validated);

        return response()->json([
            'message' => 'Usuario creado exitosamente.',
            'user'    => $user,
        ], 201);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'Usuario no encontrado.'], 404);
        }

        $validated = $request->validate([
            'name'     => 'sometimes|required|string|max:255',
            'email'    => 'sometimes|required|email|unique:users,email,' . $id,
            'password' => 'sometimes|required|string|min:8',
            'role'     => 'sometimes|required|in:admin,student',
            'status'   => 'sometimes|required|in:active,inactive',
        ]);

        if (isset($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        }

        $user->update($validated);

        return response()->json([
            'message' => 'Usuario actualizado exitosamente.',
            'user'    => $user,
        ]);
    }

    // Nuevo método para actualizar únicamente el estado (status) del usuario
    public function updateStatus(Request $request, $id): JsonResponse
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'Usuario no encontrado.'], 404);
        }
    
        $validated = $request->validate([
            'status' => 'required|in:active,inactive',
        ]);
    
        // Actualizamos el status sin disparar eventos (updateQuietly)
        $user->updateQuietly($validated);
        $user->refresh();
    
        // Limpiar la caché de los usuarios (puedes usar Cache::flush() o borrar claves específicas)
        Cache::forget("users_page_1");
    
        return response()->json([
            'message' => 'Estado actualizado exitosamente.',
            'user'    => $user,
        ]);
    }
       

    public function destroy($id): JsonResponse
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'Usuario no encontrado.'], 404);
        }

        $user->delete();

        return response()->json(['message' => 'Usuario eliminado exitosamente.']);
    }
}
