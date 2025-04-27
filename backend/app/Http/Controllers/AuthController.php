<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\UserCourseProgress;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        // Obtener el usuario por correo
        $user = User::where('email', $credentials['email'])->first();

        // Verificar si el usuario existe y que su status sea "active"
        if ($user && $user->status !== 'active') {
            return response()->json([
                'message' => 'El usuario se encuentra desactivado. Por favor, contacta al administrador.'
            ], 403);
        }

        if (Auth::attempt($credentials)) {
            $request->session()->regenerate(); // Previene fijación de sesión
            return response()->json(['user' => Auth::user()]);
        }

        return response()->json(['message' => 'Credenciales inválidas'], 401);
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['message' => 'Sesión cerrada correctamente']);
    }

    public function session(Request $request)
    {
        $user = Auth::user();
        $response = ['user' => $user];

        // Si se envía el parámetro course_id, verificamos si el usuario está inscrito en ese curso
        if ($request->has('course_id') && $user) {
            $courseId = (int) $request->query('course_id');
            $isEnrolled = UserCourseProgress::where('user_id', $user->id)
                                ->where('course_id', $courseId)
                                ->exists();
            $response['enrolled'] = $isEnrolled;
        }

        return response()->json($response);
    }

    public function register(Request $request)
    {
        $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email',
            'password' => ['required', 'string', Password::min(8)->mixedCase()->numbers()],
        ]);

        $user = User::create([
            'name'     => $request->input('name'),
            'email'    => $request->input('email'),
            'password' => Hash::make($request->input('password')),
            'role'     => 'student', // Por defecto, el registro es de estudiante
        ]);

        Auth::login($user);

        return response()->json(['user' => $user], 201);
    }
}
