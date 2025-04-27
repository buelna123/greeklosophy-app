<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AssignmentSeeder extends Seeder
{
    public function run(): void
    {
        $assignments = [
            [
                'course_id' => 1,
                'title' => 'Tarea 1: Comprensión de la Introducción',
                'description' => 'Responde las preguntas sobre la introducción y explica por qué es fundamental para el curso.',
                'due_date' => Carbon::now()->addDays(7)->toDateString(),
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ];

        DB::table('assignments')->insert($assignments);
    }
}
