<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class TopicSeeder extends Seeder
{
    public function run(): void
    {
        $now = Carbon::now();

        $topics = [
            [
                'course_id' => 1,
                'title' => 'Introducción al Curso',
                'content' => 'En este tema se presenta el curso y se introducen los conceptos básicos.',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'course_id' => 1,
                'title' => 'Conceptos Fundamentales',
                'content' => 'Aquí se explican los conceptos fundamentales que sustentan el curso.',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'course_id' => 1,
                'title' => 'Aplicaciones Prácticas',
                'content' => 'Este tema se enfoca en cómo aplicar lo aprendido en situaciones reales.',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'course_id' => 1,
                'title' => 'Avanzando en el Conocimiento',
                'content' => 'Aquí se profundiza en temas avanzados para consolidar el aprendizaje.',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'course_id' => 1,
                'title' => 'Conclusiones y Repaso',
                'content' => 'Tema final que resume el curso y ofrece un repaso general de lo aprendido.',
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ];

        DB::table('topics')->insert($topics);
    }
}
