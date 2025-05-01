<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Cloudinary\Configuration\Configuration;
use Cloudinary\Api\Upload\UploadApi;
use Exception;

class UploadToCloudinary implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected string $folder;
    protected string $filename;

    /**
     * Create a new job instance.
     */
    public function __construct(string $folder, string $filename)
    {
        $this->folder = $folder;
        $this->filename = $filename;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $localPath = storage_path("app/public/{$this->folder}/{$this->filename}");

        if (!file_exists($localPath)) {
            Log::error("Archivo no encontrado en ruta local: {$localPath}");
            return;
        }

        // Verificar variables de entorno
        if (
            !env('CLOUDINARY_CLOUD_NAME') ||
            !env('CLOUDINARY_API_KEY') ||
            !env('CLOUDINARY_API_SECRET')
        ) {
            Log::error("Faltan variables de entorno de Cloudinary.");
            return;
        }

        try {
            // Configuración de Cloudinary
            Configuration::instance([
                'cloud' => [
                    'cloud_name' => env('CLOUDINARY_CLOUD_NAME'),
                    'api_key'    => env('CLOUDINARY_API_KEY'),
                    'api_secret' => env('CLOUDINARY_API_SECRET'),
                ],
                'url' => ['secure' => true],
            ]);

            $publicId = pathinfo($this->filename, PATHINFO_FILENAME);

            $uploadResult = (new UploadApi())->upload($localPath, [
                'folder' => "greeklosophy/{$this->folder}",
                'public_id' => $publicId,
            ]);

            Log::info("Subida a Cloudinary exitosa: " . json_encode($uploadResult));

            // Eliminar archivo local si la subida fue exitosa
            Storage::disk('public')->delete("{$this->folder}/{$this->filename}");
        } catch (Exception $e) {
            Log::error("Error al subir a Cloudinary: " . $e->getMessage());
            throw $e;
        }
    }
}
