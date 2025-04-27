<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ExamOption extends Model
{
    use HasFactory;

    protected $fillable = [
        'question_id',
        'option_text',
        'is_correct',
    ];

    /**
     * Relación: La opción pertenece a una pregunta del examen.
     */
    public function examQuestion()
    {
        return $this->belongsTo(ExamQuestion::class, 'question_id');
    }
}
