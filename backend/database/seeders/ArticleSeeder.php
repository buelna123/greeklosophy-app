<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ArticleSeeder extends Seeder
{
    public function run(): void
    {
        // Deshabilitar restricciones de claves foráneas para truncar la tabla sin errores
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('articles')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // Definimos arrays de categorías y tags disponibles
        $categories = ['Filosofía', 'Ética', 'Metafísica', 'Lógica'];
        $tagsList = [
            'Filosofía'   => 'Mito, Reflexión',
            'Ética'       => 'Moral, Valores',
            'Metafísica'  => 'Ser, Existencia',
            'Lógica'      => 'Razonamiento, Argumento'
        ];

        DB::table('articles')->insert([
            [
                'title'    => 'La Alegoría de la Caverna',
                'content'  => 'Analizamos el mito de la caverna de Platón y su significado en la actualidad.',
                'author'   => 'Platón',
                'image'    => 'default.jpg',
                'category' => $categories[0],
                'tags'     => $tagsList[$categories[0]],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'title'    => 'El concepto de eudaimonía',
                'content'  => 'Exploramos cómo Aristóteles definía la felicidad y el propósito de la vida.',
                'author'   => 'Aristóteles',
                'image'    => 'default.jpg',
                'category' => $categories[1],
                'tags'     => $tagsList[$categories[1]],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'title'    => 'Parménides vs. Heráclito: El Ser y el Cambio',
                'content'  => 'Una discusión sobre las ideas de estos dos pensadores presocráticos.',
                'author'   => 'Heráclito',
                'image'    => 'default.jpg',
                'category' => $categories[2],
                'tags'     => $tagsList[$categories[2]],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'title'    => 'Sócrates y la Ética',
                'content'  => 'Cómo la mayéutica socrática transformó la filosofía moral.',
                'author'   => 'Sócrates',
                'image'    => 'default.jpg',
                'category' => $categories[1],
                'tags'     => $tagsList[$categories[1]],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'title'    => 'El Estoicismo en la Vida Moderna',
                'content'  => 'Cómo aplicar el pensamiento estoico en el mundo actual.',
                'author'   => 'Epicteto',
                'image'    => 'default.jpg',
                'category' => $categories[0],
                'tags'     => $tagsList[$categories[0]],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'title'    => 'Introducción a la lógica formal',
                'content'  => 'Bases y conceptos fundamentales para entender el razonamiento lógico.',
                'author'   => 'Aristóteles',
                'image'    => 'default.jpg',
                'category' => $categories[3],
                'tags'     => $tagsList[$categories[3]],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ]);
    }
}
