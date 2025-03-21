<?php

namespace App\Models\RBAC;

use App\Models\Traits\DateTimeFormat;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\EloquentSortable\Sortable;
use Spatie\EloquentSortable\SortableTrait;

class Menu extends Model implements Sortable
{
    use HasFactory, SortableTrait, DateTimeFormat;

    protected $table = 'rbac_menus';

    protected $appends = ['key'];
    public $fillable = ['parent_id', 'label',  'icon', 'uri', 'show', 'order'];

    public function getKeyAttribute()
    {
        return $this->uri;
    }

    public function roles()
    {
        return $this->belongsToMany(Role::class, 'rbac_role_menu');
    }

    public function children()
    {
        return $this->hasMany(Menu::class, 'parent_id');
    }

    public function parent()
    {
        return $this->belongsTo(Menu::class, 'parent_id');
    }

    public static function buildTree($need_real_menus = false)
    {

        $root_menu = ['id' => 0, 'parent_id' => 0, 'label' => 'Root', 'title' => 'Root', 'value' => 0, 'uri' => ''];
        $tree = self::buildTreeProcess();

        if (!$need_real_menus) {
            array_unshift($tree, $root_menu);
        }

        return $tree;
    }

    protected static function buildTreeProcess($parent_id = 0)
    {
        $menus = self::where('parent_id', $parent_id)
            ->orderBy('order', 'asc')
            ->get();


        $tree = [];
        foreach ($menus as $menu) {
            $children = self::buildTreeProcess($menu->id);
            $tree[] = [
                'id' => $menu->id,
                'parent_id' => $menu->parent_id,
                'label' => $menu->label,
                'title' => $menu->label,
                'value' => $menu->id,
                'icon' => $menu->icon,
                'uri' => $menu->uri,
                'show' => $menu->show,
                'order' => $menu->order,
                'children' => $children
            ];
        }

        return $tree;
    }
}
