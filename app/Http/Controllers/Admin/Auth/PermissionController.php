<?php

namespace App\Http\Controllers\Admin\Auth;

use App\Http\Controllers\Controller;
use App\Models\RBAC\Permission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PermissionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        //
        $need_real_items = $request->only('real');
        //
        $items = Permission::buildTree($need_real_items);

        return response()->json($items);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
        $request->validate([
            'parent_id' => 'required',
            'name' => 'required|unique:rbac_permissions,name,except,id',
            'slug' => 'required|unique:rbac_permissions,slug,except,id|regex:/^[a-zA-Z0-9_-]+$/'
        ]);

        $data = $request->only(['parent_id', 'name', 'slug', 'description']);

        DB::transaction(function () use ($data) {
            $permission = Permission::create($data);
        }, 5);

        return response()->json(['msg' => '已创建权限'], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
        $data = Permission::find($id);

        return response()->json($data);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
        $data = $request->only(['name', 'slug', 'description']);

        DB::transaction(function () use ($id, $data) {
            $model = Permission::find($id);
        }, 5);

        return response()->json(['msg' => '权限更新成功']);
    }

    public function update_sort(Request $request)
    {
        $request->validate(['items' => 'required']);
        $items = $request->input('items');
        $this->update_parent_id($items);

        return response()->json(['msg' => '已保存']);
    }

    private function update_parent_id(&$items = [], $parent_id = 0)
    {
        $order = 1;
        foreach ($items as &$item) {
            // $menu['parent_id'] = $parent_id;
            // $menu['order'] = $order;
            Permission::find($item['id'])->update(['parent_id' => $parent_id, 'order' => $order]);
            if (isset($item['children']) && is_array($item['children'])) {
                $this->update_parent_id($item['children'], $item['id']);
            }
            $order++;
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $item = Permission::find($id);
        if ($item) {
            $item->delete();
        }

        return response()->json(['msg' => '已删除']);
    }
}
