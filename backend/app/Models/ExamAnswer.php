<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ExamAnswer extends Model
{
    use HasFactory;

    protected $fillable = [
        'exam_result_id',
        'question_id',
        'selected_option_id',
        'is_correct',
    ];

    /**
     * Relación: Cada respuesta pertenece a un resultado de examen.
     */
    public function examResult()
    {
        return $this->belongsTo(ExamResult::class);
    }

    /**
     * Relación: Cada respuesta pertenece a una pregunta.
     */
    public function question()
    {
        return $this->belongsTo(ExamQuestion::class);
    }

    /**
     * Relación: Cada respuesta tiene una opción seleccionada.
     */
    public function selectedOption()
    {
        return $this->belongsTo(ExamOption::class, 'selected_option_id');
    }
}
