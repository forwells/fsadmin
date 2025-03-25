<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use App\Models\RBAC\Menu;
use App\Models\RBAC\Role;
use App\Models\Traits\DateTimeFormat;
use App\Models\Traits\HasPermissions;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, HasUuids, HasPermissions, DateTimeFormat;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    public function roles()
    {
        return $this->belongsToMany(Role::class, 'rbac_user_role');
    }

    public function allMenus()
    {
        if ($this->isAdministrator()) {
            $root_menus = collect(config('menus'));
            $menus_tree = collect($this->buildMenusTree(Menu::all()))->sortBy('order')->values();
            $root_menus->splice(1, 0, $menus_tree);
            return $root_menus->values();
        }

        $roles = $this->roles()->get();
        /** @todo */
        $menus = $roles->flatMap(function ($role) {
            return $role->menus;
        })->unique('id');

        $menus_tree = collect($this->buildMenusTree($menus->values()))->sortBy('order')->values();
        return $menus_tree;
    }

    protected function buildMenusTree($menus, $parent_id = 0)
    {
        $branch = [];

        foreach ($menus as $menu) {
            if ($menu['parent_id'] == $parent_id) {
                $children = $this->buildMenusTree($menus, $menu['id']);
                if ($children) {
                    $menu['children'] = $children;
                }
                $branch[] = $menu;
            }
        }
        return $branch;
    }
}
