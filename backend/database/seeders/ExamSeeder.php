<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;
use App\Models\Course;
use App\Models\Exam;
use App\Models\ExamQuestion;
use App\Models\ExamOption;

class ExamSeeder extends Seeder
{
    public function run(): void
    {
        $cursos = Course::all();

        foreach ($cursos as $course) {
            // Crear un examen por curso si no existe
            $exam = Exam::firstOrCreate(
                ['course_id' => $course->id],
                [
                    'title'       => 'Examen de ' . $course->title,
                    'description' => 'Examen para evaluar el conocimiento adquirido en el curso.',
                ]
            );

            // Añadir preguntas y opciones básicas de prueba (solo si aún no tiene preguntas)
            if ($exam->examQuestions()->count() === 0) {
                $question1 = ExamQuestion::create([
                    'exam_id'       => $exam->id,
                    'question_text' => '¿Cuál es el objetivo principal del curso?',
                    'points'        => 2,
                ]);

                $question2 = ExamQuestion::create([
                    'exam_id'       => $exam->id,
                    'question_text' => 'Menciona uno de los conceptos fundamentales aprendidos.',
                    'points'        => 3,
                ]);

                ExamOption::insert([
                    // Opciones para pregunta 1
                    [
                        'question_id' => $question1->id,
                        'option_text' => 'Presentar la estructura del curso.',
                        'is_correct'  => true,
                        'created_at'  => now(),
                        'updated_at'  => now(),
                    ],
                    [
                        'question_id' => $question1->id,
                        'option_text' => 'Aumentar la dificultad sin motivo.',
                        'is_correct'  => false,
                        'created_at'  => now(),
                        'updated_at'  => now(),
                    ],
                    // Opciones para pregunta 2
                    [
                        'question_id' => $question2->id,
                        'option_text' => 'Los conceptos básicos del curso.',
                        'is_correct'  => true,
                        'created_at'  => now(),
                        'updated_at'  => now(),
                    ],
                    [
                        'question_id' => $question2->id,
                        'option_text' => 'Una respuesta irrelevante.',
                        'is_correct'  => false,
                        'created_at'  => now(),
                        'updated_at'  => now(),
                    ],
                ]);
            }
        }
    }
}
