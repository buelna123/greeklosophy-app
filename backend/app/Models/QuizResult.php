<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class QuizResult extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'quiz_question_id',
        'selected_option_id',
        'is_correct',
        'score'
    ];

    /**
     * Relación: El resultado pertenece a un usuario.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relación: El resultado está asociado a una pregunta de quiz.
     */
    public function quizQuestion()
    {
        return $this->belongsTo(QuizQuestion::class, 'quiz_question_id');
    }

    /**
     * Relación: La opción seleccionada.
     */
    public function selectedOption()
    {
        return $this->belongsTo(QuizOption::class, 'selected_option_id');
    }
}
