<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', [\App\Http\Controllers\HomeController::class, 'index'])->name('home');

Route::get('/login', [\App\Http\Controllers\AuthController::class, 'create'])->name('auth.create');
Route::post('/login', [\App\Http\Controllers\AuthController::class, 'store'])->name('auth.store');
Route::post('/logout', [\App\Http\Controllers\AuthController::class, 'logout'])->name('auth.logout');

Route::resource('/posts', \App\Http\Controllers\PostController::class);