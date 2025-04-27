<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Deshabilitar restricciones de claves foráneas para evitar conflictos al truncar tablas
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        $this->call([
            UserSeeder::class,
            CourseSeeder::class,
            ArticleSeeder::class,
            TopicSeeder::class,
            QuizSeeder::class,
            AssignmentSeeder::class,
            ExamSeeder::class,
            BadgeSeeder::class,
        ]);

        // Rehabilitar las restricciones de claves foráneas
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }
}
