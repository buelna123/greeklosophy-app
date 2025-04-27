<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class UserCourseProgress extends Model
{
    use HasFactory;

    protected $table = 'user_course_progress';

    protected $fillable = [
        'user_id',
        'course_id',
        'progress',
        'final_grade'
    ];

    /**
     * Relación: El progreso pertenece a un usuario.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relación: El progreso pertenece a un curso.
     */
    public function course()
    {
        return $this->belongsTo(Course::class);
    }
}
