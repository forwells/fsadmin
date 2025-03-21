<?php

namespace App\Http\Controllers\Admin\Auth;

use App\Http\Controllers\Controller;
use App\Models\RBAC\Menu;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MenuController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $need_real_menus = $request->only('real');
        //
        $menus = Menu::buildTree($need_real_menus);

        return response()->json($menus);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
        $request->validate([
            'parent_id' => 'required',
            'label' => 'required|unique:rbac_menus,label,except,id',
            'uri' => 'required|regex:/^[a-zA-Z0-9\/_-]+$/|unique:rbac_menus,uri,except,id'
        ]);

        $menu_data = $request->only(['parent_id', 'label', 'uri']);

        DB::transaction(function () use ($menu_data) {
            $menu = Menu::create($menu_data);
        }, 5);

        return response()->json(['msg' => '已创建菜单'], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
        $menu = Menu::find($id);
        return response()->json($menu);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //

        $menu_data = $request->only(['parent_id', 'label', 'uri']);

        DB::transaction(function () use ($id, $menu_data) {
            $menu = Menu::findOrFail($id);
            $menu->update($menu_data);
        }, 5);

        return response()->json(['msg' => '菜单更新成功']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $item = Menu::find($id);
        if ($item) {
            $item->delete();
        }

        return response()->json(['msg' => '已删除']);
    }

    public function view_change(string $id)
    {
        $item = Menu::find($id);
        if ($item) {
            $item->show = $item->show ? 0 : 1;
            $item->save();
        }
        return response()->json(['msg' => 'success']);
    }

    public function update_sort(Request $request)
    {
        $request->validate(['items' => 'required']);
        $menus = $request->input('items');
        $this->update_parent_id($menus);

        return response()->json(['msg' => '已保存']);
    }

    private function update_parent_id(&$menus = [], $parent_id = 0)
    {
        $order = 1;
        foreach ($menus as &$menu) {
            // $menu['parent_id'] = $parent_id;
            // $menu['order'] = $order;
            Menu::find($menu['id'])->update(['parent_id' => $parent_id, 'order' => $order]);
            if (isset($menu['children']) && is_array($menu['children'])) {
                $this->update_parent_id($menu['children'], $menu['id']);
            }
            $order++;
        }
    }
}
