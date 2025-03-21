<?php

namespace App\Models\Traits;

use App\Models\RBAC\Permission;
use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Support\Collection;

trait HasPermissions
{

    /**
     * 获取用户所有权限
     *
     * @return mixed
     */
    public function allPermissions(): Collection
    {

        if ($this->isAdministrator()) {
            return Permission::all()->pluck('slug');
        }

        return $this->allPermissions =
            $this->roles
            ->pluck('slug')
            ->flatten();
    }

    /**
     * 检查用户是否拥有某个权限
     *
     * @param $ability
     * @param  array|mixed  $arguments
     * @return bool
     */
    public function can($ability, $paramters = []): bool
    {
        if (! $ability) {
            return false;
        }

        if ($this->isAdministrator()) {
            return true;
        }

        $permissions = $this->allPermissions();

        return $permissions->pluck('slug')->contains($ability) ?:
            $permissions
            ->pluck('id')
            ->contains($ability);
    }

    /**
     * 检查用户是否未拥有某个权限
     *
     * @param $permission
     * @return bool
     */
    public function cannot($ability, $arguments = []): bool
    {
        return !$this->can($ability);
    }

    /**
     * 检查用户是否是超级管理员
     *
     * @return mixed
     */
    public function isAdministrator(): bool
    {

        return $this->name === config('admin.super_master');
    }

    /**
     * 检查用户是否拥有某个角色
     *
     * @param  string  $role
     * @return mixed
     */
    public function isRole(string $role): bool
    {
        /* @var Collection $roles */
        $roles = $this->roles;

        return $roles->pluck('slug')->contains($role) ?:
            $roles->pluck('id')->contains($role);
    }

    /**
     * 检查用户是否在某些角色中
     *
     * @param  string|array|Arrayable  $roles
     * @return mixed
     */
    public function inRoles($roles = []): bool
    {
        /* @var Collection $all */
        $all = $this->roles;

        return $all->pluck('slug')->intersect($roles)->isNotEmpty() ?:
            $all->pluck('id')->intersect($roles)->isNotEmpty();
    }

    /**
     * 对于角色列表是否可见
     *
     * @param $roles
     * @return bool
     */
    public function visible($roles = []): bool
    {
        if (empty($roles)) {
            return false;
        }

        if ($this->isAdministrator()) {
            return true;
        }

        return $this->inRoles($roles);
    }
}
