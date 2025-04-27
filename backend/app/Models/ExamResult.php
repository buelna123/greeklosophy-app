<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ExamResult extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'exam_id',
        'score',
        'passed',
    ];

    /**
     * Relación: El resultado pertenece a un usuario.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relación: El resultado pertenece a un examen.
     */
    public function exam(): BelongsTo
    {
        return $this->belongsTo(Exam::class);
    }

    /**
     * Relación: El resultado tiene muchas respuestas.
     */
    public function answers(): HasMany
    {
        return $this->hasMany(ExamAnswer::class);
    }
}
