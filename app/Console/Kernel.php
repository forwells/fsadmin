<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     */
    protected function schedule(Schedule $schedule): void
    {
        // $schedule->command('inspire')->hourly();
        // 同步产品/小时
        $schedule->command('shop:get-products')->everyTwoHours();
        // 同步订单/小时
        $schedule->command('shop:get-orders')->everyTwoHours();

        // $schedule->command('shop:get-orders');
        // $schedule->command('shop:get-products');
        /** 每周一凌晨3:30分点执行一次 */

        // $schedule->command('shop:get-orders --restart=true')->weeklyOn(1, '3:20');
    }

    /**
     * Register the commands for the application.
     */
    protected function commands(): void
    {
        $this->load(__DIR__ . '/Commands');

        require base_path('routes/console.php');
    }
}
