<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    /**
     * Atributos asignables masivamente.
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'fecha_registro',
        'status',
    ];

    /**
     * Atributos ocultos para serialización.
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Casts de atributos.
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    /**
     * Relación: El usuario tiene muchos resultados de examen.
     */
    public function examResults(): HasMany
    {
        return $this->hasMany(ExamResult::class);
    }
}
