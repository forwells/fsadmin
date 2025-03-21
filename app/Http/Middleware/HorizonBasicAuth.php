<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class HorizonBasicAuth
{
    const HR_AUTH_USER = 'hr_auth_user';
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $cacheKey = self::HR_AUTH_USER;
        $authenticated = false;

        if ($request->header('PHP_AUTH_USER', null) && $request->header('PHP_AUTH_PW', null)) {
            $username = $request->header('PHP_AUTH_USER');
            $password = $request->header('PHP_AUTH_PW');

            if ($username === config('horizon.basic_auth.username') && $password === config('horizon.basic_auth.password')) {
                cache()->set(self::HR_AUTH_USER, true, now()->addMinutes(10));
                $authenticated = true;
            }
        }

        if ($authenticated === false) {
            return response()->make('Invalid credentials.', 401, ['www-authenticate' => 'Basic']);
        }

        return $next($request);
    }
}
