<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class UserBadge extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'badge_id',
        'awarded_at'
    ];

    /**
     * Relación: El registro pertenece a un usuario.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relación: El registro se asocia a una medalla.
     */
    public function badge()
    {
        return $this->belongsTo(Badge::class);
    }
}
