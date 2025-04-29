<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Config;
use Symfony\Component\HttpFoundation\Response;
use Fruitcake\Cors\HandleCors as BaseHandleCors;

class HandleCors extends BaseHandleCors
{
    /**
     * Agrega el header Access-Control-Allow-Credentials forzado.
     */
    public function handle($request, \Closure $next)
    {
        $response = parent::handle($request, $next);

        if (method_exists($response, 'headers')) {
            $response->headers->set('Access-Control-Allow-Credentials', 'true');
        }

        return $response;
    }
}
