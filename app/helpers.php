<?php

use Illuminate\Support\Facades\Http;

if (!function_exists('ddd')) {

    function ddd($var)
    {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: *');
        header('Access-Control-Allow-Headers: *');
        dd($var);
    }
}
