<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Assignment extends Model
{
    use HasFactory;

    protected $fillable = [
        'course_id',
        'title',
        'description',
        'due_date',
    ];

    protected $casts = [
        'due_date'    => 'date',
        'created_at'  => 'datetime',
        'updated_at'  => 'datetime',
    ];

    /**
     * Relación: La asignación pertenece a un curso.
     */
    public function course()
    {
        return $this->belongsTo(Course::class);
    }
}
