<?php

namespace App\Jobs;

use App\Models\Course;
use Illuminate\Bus\Queueable;
use Illuminate\Support\Facades\Log;
use Cloudinary\Configuration\Configuration;
use Cloudinary\Uploader;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;

class UploadToCloudinary implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $courseId;
    protected $localPath;

    public function __construct(int $courseId, string $localPath)
    {
        $this->courseId = $courseId;
        $this->localPath = $localPath;
    }

    public function handle(): void
    {
        $course = Course::find($this->courseId);
        if (! $course || ! Storage::disk('public')->exists($this->localPath)) {
            Log::error("UploadToCloudinary: archivo no encontrado o curso inválido", [
                'course_id' => $this->courseId,
                'localPath' => $this->localPath,
            ]);
            return;
        }

        try {
            Configuration::instance([
                'cloud' => [
                    'cloud_name' => env('CLOUDINARY_CLOUD_NAME'),
                    'api_key'    => env('CLOUDINARY_API_KEY'),
                    'api_secret' => env('CLOUDINARY_API_SECRET'),
                ],
                'url' => ['secure' => true],
            ]);

            $tempPath = Storage::disk('public')->path($this->localPath);

            $upload = Uploader::upload($tempPath, [
                'folder' => 'greeklosophy/courses',
            ]);

            // Actualizar la URL en el curso
            $course->image = $upload['secure_url'];
            $course->save();

            Log::info("UploadToCloudinary: subida exitosa", [
                'course_id' => $this->courseId,
                'url' => $upload['secure_url']
            ]);
        } catch (\Exception $e) {
            Log::error("UploadToCloudinary: fallo al subir a Cloudinary", [
                'course_id' => $this->courseId,
                'message' => $e->getMessage()
            ]);
        }
    }
}
