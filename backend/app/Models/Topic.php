<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Topic extends Model
{
    use HasFactory;

    protected $fillable = [
        'course_id',
        'title',
        'content',
        'order'
    ];

    /**
     * Relación: Un tema pertenece a un curso.
     */
    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    /**
     * Relación: Un tema tiene muchas preguntas de quiz.
     */
    public function quizQuestions()
    {
        return $this->hasMany(QuizQuestion::class);
    }
    
    /**
     * Relación (opcional): Un tema puede tener asignaciones/tareas.
     */
    public function assignments()
    {
        return $this->hasMany(Assignment::class);
    }
}
