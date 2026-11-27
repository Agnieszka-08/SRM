<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\StudentController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

   
    // Student Management

    Route::get('/students', [StudentController::class, 'index'])
        ->name('students.index');

    Route::get('/students/archived', [StudentController::class, 'archived'])
        ->name('students.archived');

    Route::get('/students/create', [StudentController::class, 'create'])
        ->name('students.create');

    Route::post('/students', [StudentController::class, 'store'])
        ->name('students.store');

    Route::patch('/students/{student}/archive', [StudentController::class, 'archive'])
        ->name('students.archive');

    Route::patch('/students/{student}/restore', [StudentController::class, 'restore'])
        ->name('students.restore');

    Route::get('/students/{student}', [StudentController::class, 'show'])
        ->name('students.show');

    Route::get('/students/{student}/edit', [StudentController::class, 'edit'])
        ->name('students.edit');

    Route::put('/students/{student}', [StudentController::class, 'update'])
        ->name('students.update');


});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
