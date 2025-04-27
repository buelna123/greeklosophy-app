<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class BadgeSeeder extends Seeder
{
    public function run(): void
    {
        $badges = [
            [
                'name' => 'Principiante',
                'description' => 'Otorgado al iniciar el curso.',
                'criteria' => 'Iniciar curso',
                'icon' => 'badge_principiante.png',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'Avanzado',
                'description' => 'Otorgado al obtener una calificación superior al 80%.',
                'criteria' => 'final_grade>=80',
                'icon' => 'badge_avanzado.png',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'Sobresaliente',
                'description' => 'Otorgado al obtener una calificación superior al 90%.',
                'criteria' => 'final_grade>=90',
                'icon' => 'badge_sobresaliente.png',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ];

        DB::table('badges')->insert($badges);
    }
}
