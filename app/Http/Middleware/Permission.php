<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class Permission
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$args): Response
    {
        /** @var \App\Models\User */
        $user = $request->user();
        if (
            !$user
            || $user->isAdministrator()
        ) {
            return $next($request);
        }
    }
}
