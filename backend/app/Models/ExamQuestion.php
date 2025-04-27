<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ExamQuestion extends Model
{
    use HasFactory;

    protected $fillable = [
        'exam_id',
        'question_text',
        'points',
    ];

    /**
     * Relación: La pregunta pertenece a un examen.
     */
    public function exam(): BelongsTo
    {
        return $this->belongsTo(Exam::class);
    }

    /**
     * Relación: La pregunta tiene muchas opciones.
     */
    public function examOptions(): HasMany
    {
        return $this->hasMany(ExamOption::class, 'question_id');
    }
}
