<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use App\Models\Course;

class CourseSeeder extends Seeder
{
    public function run(): void
    {
        // Deshabilitar restricciones de claves foráneas para poder truncar la tabla sin errores
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        Course::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // Definimos arrays de categorías y tags disponibles
        $categories = ['Filosofía', 'Ética', 'Historia', 'Lógica', 'Literatura'];
        $tagsList = [
            'Filosofía'   => 'Reflexión, Pensamiento',
            'Ética'       => 'Moral, Valores',
            'Historia'    => 'Antigüedad, Tradición',
            'Lógica'      => 'Razonamiento, Argumento',
            'Literatura'  => 'Narrativa, Poesía'
        ];

        DB::table('courses')->insert([
            [
                'title'       => 'Platón y la Teoría de las Ideas',
                'description' => 'Explora la filosofía de Platón y su influencia en el pensamiento occidental.',
                'image'       => 'platon.jpg',
                'category'    => $categories[0],
                'tags'        => $tagsList[$categories[0]],
                'created_at'  => Carbon::now(),
                'updated_at'  => Carbon::now(),
            ],
            [
                'title'       => 'Aristóteles: Ética y Lógica',
                'description' => 'Un recorrido por la ética, metafísica y lógica aristotélica.',
                'image'       => 'aristoteles.jpg',
                'category'    => $categories[1],
                'tags'        => $tagsList[$categories[1]],
                'created_at'  => Carbon::now(),
                'updated_at'  => Carbon::now(),
            ],
            [
                'title'       => 'Los Presocráticos',
                'description' => 'Descubre a los primeros filósofos y sus teorías sobre el cosmos.',
                'image'       => 'presocraticos.jpg',
                'category'    => $categories[2],
                'tags'        => $tagsList[$categories[2]],
                'created_at'  => Carbon::now(),
                'updated_at'  => Carbon::now(),
            ],
            [
                'title'       => 'La Sofística y Sócrates',
                'description' => 'Analiza la diferencia entre los sofistas y la ética socrática.',
                'image'       => 'socrates.jpg',
                'category'    => $categories[0],
                'tags'        => $tagsList[$categories[0]],
                'created_at'  => Carbon::now(),
                'updated_at'  => Carbon::now(),
            ],
            [
                'title'       => 'El Estoicismo y el Epicureísmo',
                'description' => 'Dos formas de vida filosófica en la Grecia helenística.',
                'image'       => 'estoicismo_epicureismo.jpg',
                'category'    => $categories[0],
                'tags'        => $tagsList[$categories[0]],
                'created_at'  => Carbon::now(),
                'updated_at'  => Carbon::now(),
            ],
        ]);
    }
}
