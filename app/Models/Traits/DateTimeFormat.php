<?php

namespace App\Models\Traits;

use DateTimeInterface;

trait DateTimeFormat
{
    protected function serializeDate(DateTimeInterface $date)
    {
        return $date->format('Y-m-d H:i:s');
    }
}
