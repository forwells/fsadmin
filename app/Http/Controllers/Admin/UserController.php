<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $users = User::all()->where('name', '!=', 'admin');

        return response()->json(UserResource::collection($users));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
        $request->validate([
            'name' => 'required|alpha_num|max:40|unique:users,name',
            'email' => 'required|email|unique:users,email,except,id',
            'password' => 'required|min:6|max:20'
        ]);

        $user_data = $request->only(['name', 'email', 'password', 'role_ids']);
        $user_data['password'] = bcrypt($user_data['password']);

        DB::transaction(function () use ($user_data) {
            $user = User::create($user_data);
            $user->roles()->sync($user_data['role_ids']);
        }, 5);


        return response()->json(['msg' => '已创建新用户', 'data' => $user_data], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
        $user = User::findOrFail($id);
        $user->role_ids = $user->roles()->pluck('id')->toArray();
        return response()->json($user);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $user_data = $request->only(['email', 'password', 'role_ids']);

        if (!$user_data['password']) {
            unset($user_data['password']);
        } else {
            $user_data['password'] = bcrypt($user_data['password']);
        }

        DB::transaction(function () use ($id, $user_data) {
            $user = User::findOrFail($id);
            $user->update($user_data);
            $user->roles()->sync($user_data['role_ids']);
        }, 5);

        return response()->json(['msg' => '用户更新成功']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        /** @todo */
        User::find($id)->delete();
        return response()->json(['msg' => '用户已删除']);
    }
}
