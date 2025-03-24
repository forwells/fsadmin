<?php

namespace App\Console\Commands\Admin;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

use function Laravel\Prompts\info;
use function Laravel\Prompts\password;
use function Laravel\Prompts\text;

class ResetPassword extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'admin:reset:password';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Reset admin account password';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        //
        $name = text('Username:', required: true);
        if (!User::where('name', $name)->exists()) {
            info('用户不存在');
            return Command::FAILURE;
        }

        $password = password('New password:', required: true);

        $user = User::where('name', $name)->first();
        $user->password = Hash::make($password);
        $user->save();

        info("{$name} password changed.");
        return Command::SUCCESS;
    }
}
