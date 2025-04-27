<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    // Campos asignables masivamente
    protected $fillable = [
        'title',
        'content',
        'author',
        'image',
        'category',
        'tags',
    ];

    // Usamos created_at y updated_at para las fechas
    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
}
