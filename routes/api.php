<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::post('login', [Admin\AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    // token有效性
    Route::get('/validate-token', function () {
        return response()->json(['valid' => true]);
    });
    // 用户模块
    Route::prefix('user')->group(function () {
        Route::get('/', [Admin\AuthController::class, 'me']);
        Route::post('logout', [Admin\AuthController::class, 'logout']);
        Route::apiResource('rs', Admin\UserController::class);
        Route::apiResource('role', Admin\Auth\RoleController::class);
        Route::apiResource('permission', Admin\Auth\PermissionController::class);
        Route::post('permission/sort', [Admin\Auth\PermissionController::class, 'update_sort']);
        Route::apiResource('menu', Admin\Auth\MenuController::class);
        Route::post('menu/sort', [Admin\Auth\MenuController::class, 'update_sort']);
        Route::post('menu/{id}/view_change', [Admin\Auth\MenuController::class, 'view_change']);
    });


    // 设置模块
    Route::prefix('settings')->group(function () {});
});
