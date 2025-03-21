<?php

namespace App\Models\RBAC;

use App\Models\Traits\DateTimeFormat;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\EloquentSortable\Sortable;
use Spatie\EloquentSortable\SortableTrait;

class Permission extends Model implements Sortable
{
    use HasFactory, SortableTrait, DateTimeFormat;

    protected $table = 'rbac_permissions';

    public $fillable = ['parent_id', 'name', 'slug', 'description', 'order'];

    public function roles()
    {
        return $this->belongsToMany(Role::class, 'rbac_role_permission');
    }

    public function children()
    {
        return $this->hasMany(Menu::class, 'parent_id');
    }

    public function parent()
    {
        return $this->belongsTo(Menu::class, 'parent_id');
    }

    public static function buildTree($need_real_items = false)
    {

        $root_menu = ['id' => 0, 'parent_id' => 0, 'label' => 'Root', 'title' => 'Root', 'value' => 0];
        $tree = self::buildTreeProcess();

        if (!$need_real_items) {
            array_unshift($tree, $root_menu);
        }

        return $tree;
    }

    protected static function buildTreeProcess($parent_id = 0)
    {
        $items = self::where('parent_id', $parent_id)
            ->orderBy('order', 'asc')
            ->get();


        $tree = [];
        foreach ($items as $item) {
            $children = self::buildTreeProcess($item->id);
            $tree[] = [
                'id' => $item->id,
                'parent_id' => $item->parent_id,
                'label' => $item->name,
                'title' => $item->name,
                'value' => $item->id,
                'order' => $item->order,
                'children' => $children
            ];
        }

        return $tree;
    }
}
