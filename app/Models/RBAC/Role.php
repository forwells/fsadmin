<?php

namespace App\Models\RBAC;

use App\Models\Shop\Site;
use App\Models\Traits\DateTimeFormat as TraitsDateTimeFormat;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    use HasFactory, TraitsDateTimeFormat;
    protected $table = 'rbac_roles';

    public $fillable = ['name', 'slug', 'description', 'status'];

    public function permissions()
    {
        return $this->belongsToMany(Permission::class, 'rbac_role_permission');
    }

    public function menus()
    {
        return $this->belongsToMany(Menu::class, 'rbac_role_menu');
    }

    public function sites()
    {
        return $this->belongsToMany(Site::class, 'rbac_role_site');
    }
}
