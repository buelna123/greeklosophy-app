<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class QuizQuestion extends Model
{
    use HasFactory;

    protected $fillable = [
        'topic_id',
        'question_text',
        'points'
    ];

    /**
     * Relación: La pregunta pertenece a un tema.
     */
    public function topic()
    {
        return $this->belongsTo(Topic::class);
    }

    /**
     * Relación: La pregunta tiene muchas opciones.
     */
    public function quizOptions()
    {
        return $this->hasMany(QuizOption::class, 'question_id');
    }
    
    /**
     * Relación: Las respuestas al quiz para esta pregunta.
     */
    public function quizResults()
    {
        return $this->hasMany(QuizResult::class, 'quiz_question_id');
    }
}
