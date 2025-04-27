<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    // Campos asignables masivamente
    protected $fillable = [
        'title',
        'description',
        'image',
        'category',
        'tags',
    ];

    // Trabajamos con created_at y updated_at como datetime
    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
}
