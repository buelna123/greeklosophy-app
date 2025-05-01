<?php

namespace App\Helpers;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;

class FileHelper
{
    /**
     * Genera un nombre de archivo único con extensión original.
     */
    public static function generateUniqueFilename(UploadedFile $file, string $prefix = 'img_'): string
    {
        $extension = $file->getClientOriginalExtension();
        $filename = $prefix . Str::random(40) . '.' . $extension;
        return $filename;
    }

    /**
     * Devuelve la ruta pública donde se debe guardar el archivo.
     */
    public static function getPublicStoragePath(string $folder, string $filename): string
    {
        return $folder . '/' . $filename; // Ej: courses/picture.jpg
    }

    /**
     * Devuelve la URL de acceso público al archivo, basada en api.php.
     */
    public static function getPublicUrl(string $folder, string $filename): string
    {
        return '/api/public/' . $folder . '/' . $filename;
    }
}
