<?php

use App\Http\Controllers\Ui\BackendController;
use App\Http\Controllers\Ui\FrontendController;
use Illuminate\Support\Facades\Route;

Route::get('/', [FrontendController::class, 'signIn']);
Route::get('/dashbaord', [BackendController::class, 'index']);
Route::get('/users', [BackendController::class, 'users']);
Route::get('/bookings', [BackendController::class, 'bookings']);
Route::get('/bookings/create', [BackendController::class, 'bookingCreate']);
Route::get('/bookings/{uniqId}/edit', [BackendController::class, 'bookingEdit'])->whereUuid('uniqId');
Route::get('/reports', [BackendController::class, 'reports']);
Route::get('/settings', [BackendController::class, 'settings']);