<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB; // Asegúrate de importar DB
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Deshabilita las restricciones de clave foránea para truncar la tabla sin errores
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        // Limpia la tabla (opcional en desarrollo)
        User::truncate();

        User::create([
            'name'     => 'Admin User',
            'email'    => 'admin@admin.com',
            'password' => Hash::make('admin1234'),
            'role'     => 'admin',
        ]);

        User::create([
            'name'     => 'Student User',
            'email'    => 'student@student.com',
            'password' => Hash::make('student1234'),
            'role'     => 'student',
        ]);

        // Vuelve a habilitar las restricciones de clave foránea
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }
}
