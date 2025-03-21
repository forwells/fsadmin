<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 角色表
        Schema::create('rbac_roles', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug', 80)->unique()->comment('唯一角色标识');
            $table->string('description')->nullable();
            $table->tinyInteger('status')->default(1)->comment('角色是否可用');
            $table->timestamps();
        });
        // 权限表
        Schema::create('rbac_permissions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('parent_id')->default(0)->comment('父级权限id');
            $table->string('name');
            $table->string('slug', 80)->unique()->comment('唯一权限标识');
            $table->string('description')->nullable();
            $table->integer('order')->default(0)->comment('排序');
            $table->timestamps();
        });
        /** 菜单表 */
        Schema::create('rbac_menus', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('parent_id')->default(0)->comment('父菜单id');
            $table->string('label')->comment('菜单名称');
            $table->string('icon')->nullable()->comment('图标');
            $table->string('uri')->nullable()->comment('路由');
            $table->tinyInteger('show')->default(1)->comment('可见性');
            $table->integer('order')->default(0)->comment('排序');
            $table->timestamps();
        });

        /** 中间表 用户和角色多对多的关系 */
        Schema::create('rbac_user_role', function (Blueprint $table) {
            $table->foreignUuid('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->bigInteger('role_id')->references('id')->on('rbac_roles')->onDelete('cascade');
            $table->unique(['role_id', 'user_id']); //联合索引限制多对多中只能唯一对应用户和角色
            $table->timestamps();
        });

        /** 中间表 角色和权限多对多的关系 */
        Schema::create('rbac_role_permission', function (Blueprint $table) {
            $table->foreignId('role_id')->references('id')->on('rbac_roles')->onDelete('cascade');
            $table->foreignId('permission_id')->references('id')->on('rbac_permissions')->onDelete('cascade');
            $table->unique(['role_id', 'permission_id']); //联合索引限制多对多中只能唯一对应角色和权限
            $table->timestamps();
        });

        // 中间表 角色和菜单的对对多关系
        Schema::create('rbac_role_menu', function (Blueprint $table) {
            $table->foreignId('role_id')->constrained('rbac_roles')->onDelete('cascade');
            $table->foreignId('menu_id')->constrained('rbac_menus')->onDelete('cascade');
            $table->unique(['role_id', 'menu_id']); // 联合索引

            $table->timestamps();
        });

        // 中间表 权限和菜单的对对多关系 * 弃用
        // Schema::create('rbac_permission_menu', function (Blueprint $table) {
        //     $table->foreignId('permission_id')->constrained('rbac_permissions')->onDelete('cascade');
        //     $table->foreignId('menu_id')->constrained('rbac_menus')->onDelete('cascade');
        //     $table->unique(['permission_id', 'menu_id']); // 联合索引

        //     $table->timestamps();
        // });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::disableForeignKeyConstraints();
        Schema::dropIfExists('rbac_roles');
        Schema::dropIfExists('rbac_permissions');
        Schema::dropIfExists('rbac_menus');
        Schema::dropIfExists('rbac_role_permission');
        Schema::dropIfExists('rbac_user_role');
        Schema::dropIfExists('rbac_role_menu');
        // Schema::dropIfExists('rbac_permission_menu');
        Schema::enableForeignKeyConstraints();
    }
};
