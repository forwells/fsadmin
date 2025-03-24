<?php

namespace App\Console\Commands\Admin;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;
use Str;

use function Laravel\Prompts\info;
use function Laravel\Prompts\password;
use function Laravel\Prompts\text;

class CreateAdminUser extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'admin:user:create';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create admin account';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        //
        $name = text('Username:', required: true);
        $password = password('Password:', required: true);

        $confirm_password = password('Confirm Password:', required: true);

        if ($password !== $confirm_password) {
            $this->error('Confirm password not crorect, please confirm.');
            return Command::FAILURE;
        }
        $placeholder_email = Str::orderedUuid() . '@placeholder.com';
        if (User::where('email', $placeholder_email)->exists()) {
            $this->error('Email is exists.');
            return Command::FAILURE;
        }
        User::create([
            'id' => Str::orderedUuid(),
            'name' => $name,
            'email' => $placeholder_email,
            'password' => Hash::make($password)
        ]);

        info("[{$name}] Created");
        return Command::SUCCESS;
    }
}
