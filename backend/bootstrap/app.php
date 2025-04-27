<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->alias([
            'startSession' => \Illuminate\Session\Middleware\StartSession::class,
            'cookies' => \Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse::class,
        ]);

        $middleware->group('api', [
            'cookies',
            'startSession',
            'throttle:60,1', // ← límite de 60 requests por minuto SIN necesidad de registrar "api"
            \Illuminate\Routing\Middleware\SubstituteBindings::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
