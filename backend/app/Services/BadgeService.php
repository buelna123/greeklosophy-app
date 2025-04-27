<?php

namespace App\Services;

use App\Models\Badge;
use App\Models\UserBadge;
use Carbon\Carbon;

class BadgeService
{
    /**
     * Asigna medallas al usuario basándose en el resultado del examen.
     *
     * Se evalúan criterios simples:
     * - Si el porcentaje es mayor o igual a 90%, se asigna la medalla "Sobresaliente".
     * - Si el porcentaje es mayor o igual a 80% y menor a 90%, se asigna "Avanzado".
     * - Si el porcentaje es mayor o igual a 60% y menor a 80%, se asigna "Principiante".
     * 
     * @param  mixed  $user  El modelo del usuario
     * @param  mixed  $exam  El modelo del examen
     * @param  int  $totalScore  Puntaje obtenido
     * @param  int  $maxScore    Puntaje máximo posible
     * @return void
     */
    public static function assignBadgesAfterExam($user, $exam, $totalScore, $maxScore)
    {
        if ($maxScore <= 0) {
            return;
        }

        $percentage = ($totalScore / $maxScore) * 100;
        $badgeName = null;

        if ($percentage >= 90) {
            $badgeName = 'Sobresaliente';
        } elseif ($percentage >= 80) {
            $badgeName = 'Avanzado';
        } elseif ($percentage >= 60) {
            $badgeName = 'Principiante';
        }

        if (!$badgeName) {
            return;
        }

        $badge = Badge::where('name', $badgeName)->first();
        if (!$badge) {
            $badge = Badge::create([
                'name' => $badgeName,
                'description' => 'Medalla asignada automáticamente por examen con puntaje del ' . number_format($percentage, 2) . '%',
                'criteria' => "Examen: {$percentage}%",
                'icon' => strtolower($badgeName) . '.png',
            ]);
        }

        $alreadyAssigned = UserBadge::where('user_id', $user->id)
                            ->where('badge_id', $badge->id)
                            ->exists();

        if (!$alreadyAssigned) {
            UserBadge::create([
                'user_id' => $user->id,
                'badge_id' => $badge->id,
                'awarded_at' => Carbon::now(),
            ]);
        }
    }
}
