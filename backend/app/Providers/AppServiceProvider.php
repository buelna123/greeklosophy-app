<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\URL;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary; 

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        \Artisan::call('config:clear');
        \Artisan::call('route:clear');
        \Artisan::call('view:clear');
        \Artisan::call('cache:clear');
        \Artisan::call('clear-compiled');
        if (app()->environment('production')) {
            URL::forceScheme('https');
        }
    
    }
}
