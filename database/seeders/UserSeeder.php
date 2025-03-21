<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
    // use WithoutModelEvents;
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        DB::table('users')->insert([
            'id' => Str::orderedUuid(),
            'name' => env('DEFAULT_ADMIN_NAME', 'admin'),
            'email' => env('DEFAULT_ADMIN_EMAIL', 'admin@email.com'),
            'password' => Hash::make(env('SEEDER_ADMIN_PASSWORD', 'password'))
        ]);
    }
}
