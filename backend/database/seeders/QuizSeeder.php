<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class QuizSeeder extends Seeder
{
    public function run(): void
    {
        $now = Carbon::now();

        // === TOPIC 1 ===
        DB::table('quiz_questions')->insert([
            [
                'id' => 1,
                'topic_id' => 1,
                'question_text' => '¿Qué se presenta en la introducción del curso?',
                'points' => 1,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'id' => 2,
                'topic_id' => 1,
                'question_text' => '¿Qué objetivo tiene la introducción?',
                'points' => 1,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'id' => 3,
                'topic_id' => 1,
                'question_text' => '¿Qué aprenderás en esta sección?',
                'points' => 1,
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ]);

        // Opciones TOPIC 1
        DB::table('quiz_options')->insert([
            ['question_id' => 1, 'option_text' => 'Una presentación general.', 'is_correct' => true, 'created_at' => $now, 'updated_at' => $now],
            ['question_id' => 1, 'option_text' => 'Exámenes finales.', 'is_correct' => false, 'created_at' => $now, 'updated_at' => $now],

            ['question_id' => 2, 'option_text' => 'Brindar contexto y motivación.', 'is_correct' => true, 'created_at' => $now, 'updated_at' => $now],
            ['question_id' => 2, 'option_text' => 'Exponer ejercicios prácticos.', 'is_correct' => false, 'created_at' => $now, 'updated_at' => $now],

            ['question_id' => 3, 'option_text' => 'Conceptos clave del curso.', 'is_correct' => true, 'created_at' => $now, 'updated_at' => $now],
            ['question_id' => 3, 'option_text' => 'Notas de evaluación.', 'is_correct' => false, 'created_at' => $now, 'updated_at' => $now],
        ]);

        // === TOPIC 2 ===
        DB::table('quiz_questions')->insert([
            ['id' => 4, 'topic_id' => 2, 'question_text' => '¿Qué son los conceptos fundamentales?', 'points' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['id' => 5, 'topic_id' => 2, 'question_text' => '¿Por qué es importante conocerlos?', 'points' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['id' => 6, 'topic_id' => 2, 'question_text' => '¿Dónde se aplican estos conceptos?', 'points' => 1, 'created_at' => $now, 'updated_at' => $now],
        ]);

        DB::table('quiz_options')->insert([
            ['question_id' => 4, 'option_text' => 'Bases teóricas esenciales.', 'is_correct' => true, 'created_at' => $now, 'updated_at' => $now],
            ['question_id' => 4, 'option_text' => 'Notas administrativas.', 'is_correct' => false, 'created_at' => $now, 'updated_at' => $now],

            ['question_id' => 5, 'option_text' => 'Permiten construir argumentos.', 'is_correct' => true, 'created_at' => $now, 'updated_at' => $now],
            ['question_id' => 5, 'option_text' => 'Son irrelevantes.', 'is_correct' => false, 'created_at' => $now, 'updated_at' => $now],

            ['question_id' => 6, 'option_text' => 'En análisis y reflexión.', 'is_correct' => true, 'created_at' => $now, 'updated_at' => $now],
            ['question_id' => 6, 'option_text' => 'Solo en exámenes.', 'is_correct' => false, 'created_at' => $now, 'updated_at' => $now],
        ]);

        // === TOPIC 3 ===
        DB::table('quiz_questions')->insert([
            ['id' => 7, 'topic_id' => 3, 'question_text' => '¿Qué son las aplicaciones prácticas?', 'points' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['id' => 8, 'topic_id' => 3, 'question_text' => '¿Cuál es su propósito?', 'points' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['id' => 9, 'topic_id' => 3, 'question_text' => '¿Qué habilidades desarrollan?', 'points' => 1, 'created_at' => $now, 'updated_at' => $now],
        ]);

        DB::table('quiz_options')->insert([
            ['question_id' => 7, 'option_text' => 'Ejemplos reales de uso.', 'is_correct' => true, 'created_at' => $now, 'updated_at' => $now],
            ['question_id' => 7, 'option_text' => 'Resumen del curso.', 'is_correct' => false, 'created_at' => $now, 'updated_at' => $now],

            ['question_id' => 8, 'option_text' => 'Facilitar la comprensión.', 'is_correct' => true, 'created_at' => $now, 'updated_at' => $now],
            ['question_id' => 8, 'option_text' => 'Agregar más tareas.', 'is_correct' => false, 'created_at' => $now, 'updated_at' => $now],

            ['question_id' => 9, 'option_text' => 'Pensamiento crítico.', 'is_correct' => true, 'created_at' => $now, 'updated_at' => $now],
            ['question_id' => 9, 'option_text' => 'Memorización.', 'is_correct' => false, 'created_at' => $now, 'updated_at' => $now],
        ]);

        // === TOPIC 4 ===
        DB::table('quiz_questions')->insert([
            ['id' => 10, 'topic_id' => 4, 'question_text' => '¿Qué implica avanzar en el conocimiento?', 'points' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['id' => 11, 'topic_id' => 4, 'question_text' => '¿Qué se requiere para profundizar?', 'points' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['id' => 12, 'topic_id' => 4, 'question_text' => '¿Cómo se evalúa este progreso?', 'points' => 1, 'created_at' => $now, 'updated_at' => $now],
        ]);

        DB::table('quiz_options')->insert([
            ['question_id' => 10, 'option_text' => 'Explorar nuevas ideas.', 'is_correct' => true, 'created_at' => $now, 'updated_at' => $now],
            ['question_id' => 10, 'option_text' => 'Repetir el contenido.', 'is_correct' => false, 'created_at' => $now, 'updated_at' => $now],

            ['question_id' => 11, 'option_text' => 'Estudio constante y disciplina.', 'is_correct' => true, 'created_at' => $now, 'updated_at' => $now],
            ['question_id' => 11, 'option_text' => 'Evitar repasar temas.', 'is_correct' => false, 'created_at' => $now, 'updated_at' => $now],

            ['question_id' => 12, 'option_text' => 'Evaluación práctica y reflexiva.', 'is_correct' => true, 'created_at' => $now, 'updated_at' => $now],
            ['question_id' => 12, 'option_text' => 'Solo exámenes teóricos.', 'is_correct' => false, 'created_at' => $now, 'updated_at' => $now],
        ]);

        // === TOPIC 5 ===
        DB::table('quiz_questions')->insert([
            ['id' => 13, 'topic_id' => 5, 'question_text' => '¿Qué se revisa en las conclusiones?', 'points' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['id' => 14, 'topic_id' => 5, 'question_text' => '¿Para qué sirve el repaso?', 'points' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['id' => 15, 'topic_id' => 5, 'question_text' => '¿Qué acciones siguen después?', 'points' => 1, 'created_at' => $now, 'updated_at' => $now],
        ]);

        DB::table('quiz_options')->insert([
            ['question_id' => 13, 'option_text' => 'Síntesis de los aprendizajes.', 'is_correct' => true, 'created_at' => $now, 'updated_at' => $now],
            ['question_id' => 13, 'option_text' => 'Nueva materia.', 'is_correct' => false, 'created_at' => $now, 'updated_at' => $now],

            ['question_id' => 14, 'option_text' => 'Consolidar conocimientos.', 'is_correct' => true, 'created_at' => $now, 'updated_at' => $now],
            ['question_id' => 14, 'option_text' => 'Eliminar temas.', 'is_correct' => false, 'created_at' => $now, 'updated_at' => $now],

            ['question_id' => 15, 'option_text' => 'Aplicación práctica.', 'is_correct' => true, 'created_at' => $now, 'updated_at' => $now],
            ['question_id' => 15, 'option_text' => 'Ignorar lo aprendido.', 'is_correct' => false, 'created_at' => $now, 'updated_at' => $now],
        ]);
    }
}
