<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    //
    public function login(Request $request)
    {
        $credentials = $request->only('name', 'password');
        if (Auth::attempt($credentials)) {
            /** @var \App\Models\User */
            $user = Auth::user();
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'message' => 'login success.',
                'access_token' => $token,
                'expires' => 120,
                'user' => [
                    'roles' => []
                ]
            ]);
        }

        return response()->json(['message' => 'Unauthrorized'], 401);
    }

    public function logout(Request $request)
    {
        /** @var \App\Models\User */
        $user = $request->user();

        $user->tokens()->delete();

        return response()->json(['message' => 'logout']);
    }

    /**
     * 获取当前用户
     */
    public function me(Request $request)
    {
        /** @var \App\Models\User */
        $user = $request->user();
        $user->permissions = $user->allPermissions();
        $user->menus = $user->allMenus();
        return response()->json($user);
    }
}
