<?php

namespace App\Http\Controllers\Admin\Auth;

use App\Http\Controllers\Controller;
use App\Http\Resources\RoleResource;
use App\Models\RBAC\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RoleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $roles = Role::all();

        return response()->json(RoleResource::collection($roles));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
        $request->validate([
            'name' => 'required',
            'slug' => 'required|regex:/^[a-zA-Z0-9_-]+$/'
        ]);

        $role_data = $request->only(['name', 'slug', 'description', 'permission_ids', 'menu_ids', 'site_ids']);

        DB::transaction(function () use ($role_data) {
            $role = Role::create($role_data);
            $role->permissions()->sync($role_data['permission_ids']);
            $role->menus()->sync($role_data['menu_ids']);
            $role->sites()->sync($role_data['site_ids']);
        }, 5);

        return response()->json(['msg' => '已创建角色'], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
        $role = Role::findOrFail($id);
        // ddh($role);
        $role->permission_ids = $role->permissions()->pluck('id')->toArray();
        $role->menu_ids = $role->menus()->pluck('id')->toArray();
        $role->site_ids = $role->sites()->pluck('id')->toArray();
        return response()->json($role);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
        $role_data = $request->only(['name', 'slug', 'description', 'permission_ids', 'menu_ids', 'site_ids']);
        DB::transaction(function () use ($role_data, $id) {
            $role = Role::find($id);
            $role->update($role_data);
            $role->permissions()->sync($role_data['permission_ids']);
            $role->menus()->sync($role_data['menu_ids']);
            $role->sites()->sync($role_data['site_ids']);
        }, 5);


        return response()->json(['msg' => '角色更新成功']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        /** @todo */
        $role = Role::findOrFail($id);
        $role->delete();
        return response()->json(['msg' => '已删除']);
    }

    // public function attach_permission(Request $request, $role_id)
    // {
    //     $role = Role::findOrFail($role_id);

    //     $validated = $request->validate([
    //         'permission_ids' => 'required|array',
    //         'permission_ids.*' => 'exists:rbac_permissions,id'
    //     ]);

    //     $role->permissions()->syncWithoutDetaching($validated['permission_ids']);

    //     return response()->json(['msg' => '权限已附加']);
    // }

    // public function attach_menu(Request $request, $role_id)
    // {
    //     $role = Role::findOrFail($role_id);

    //     $validated = $request->validate([
    //         'menu_ids' => 'required|array',
    //         'menu_ids.*' => 'exists:rbac_menus,id'
    //     ]);

    //     $role->menus()->syncWithoutDetaching($validated['menu_ids']);
    // }
}
