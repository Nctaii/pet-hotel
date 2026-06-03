<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/test-db', function () {
    try {
        $conn = DB::connection('mongodb');
        $conn->getMongoDB()->command(['ping' => 1]);
        return 'MongoDB connected!';
    } catch (\Exception $e) {
        return 'Error: ' . $e->getMessage();
    }
});