<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Cloudinary\Configuration\Configuration;
use Cloudinary\Api\Upload\UploadApi;
use Illuminate\Support\Facades\Storage;

class UploadToCloudinary implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected string $folder;
    protected string $filename;

    public function __construct(string $folder, string $filename)
    {
        $this->folder = $folder;
        $this->filename = $filename;
    }

    public function handle(): void
    {
        $localPath = storage_path("app/public/{$this->folder}/{$this->filename}");

        if (!file_exists($localPath)) {
            throw new \Exception("Archivo no encontrado: {$localPath}");
        }

        // Configurar Cloudinary manualmente
        Configuration::instance([
            'cloud' => [
                'cloud_name' => env('CLOUDINARY_CLOUD_NAME'),
                'api_key'    => env('CLOUDINARY_API_KEY'),
                'api_secret' => env('CLOUDINARY_API_SECRET'),
            ],
            'url' => ['secure' => true]
        ]);

        $upload = (new UploadApi())->upload($localPath, [
            'folder' => 'greeklosophy/' . $this->folder,
            'public_id' => pathinfo($this->filename, PATHINFO_FILENAME)
        ]);

        // Elimina el archivo local después de subir
        Storage::disk('public')->delete("{$this->folder}/{$this->filename}");
    }
}
