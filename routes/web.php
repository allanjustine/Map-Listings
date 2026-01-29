<?php

use App\Http\Controllers\ActivityController;
use App\Http\Controllers\CoordinateController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::redirect('/', 'coordinates');

Route::get('dashboard', function () {
    return Inertia::render('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::resource('coordinates', CoordinateController::class);
Route::resource('activities', ActivityController::class);

require __DIR__ . '/settings.php';
