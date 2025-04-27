<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Badge extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'criteria',
        'icon'
    ];

    /**
     * Relación: Una medalla puede tener varios registros en user_badges.
     */
    public function userBadges()
    {
        return $this->hasMany(UserBadge::class);
    }
}
