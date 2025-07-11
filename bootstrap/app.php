<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // add new middleware
        $middleware->append([
            \App\Http\Middleware\HandleCors::class
        ]);
        // alias
        $middleware->alias([
            'permission' => \App\Http\Middleware\CheckPermission::class,
            'horizon.basic_auth' => \App\Http\Middleware\HorizonBasicAuth::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
