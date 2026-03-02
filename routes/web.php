<?php

use App\Http\Controllers\Ui\BackendController;
use App\Http\Controllers\Ui\CommonController;
use App\Http\Controllers\Ui\FrontendController;
use App\Http\Controllers\Api\GoogleMeet\GoogleMeetController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Route;

Route::get('/sign-in', [FrontendController::class, 'signIn']);
Route::get('/', [CommonController::class, 'bookingCreate'])->defaults('layoutContext', 'frontend');
Route::get('/dashbaord', [BackendController::class, 'index']);
Route::get('/users', [BackendController::class, 'users']);
Route::get('/users/{user}', [BackendController::class, 'userShow'])->whereNumber('user');
Route::get('/users/{user}/edit', [BackendController::class, 'userEdit'])->whereNumber('user');
Route::get('/bookings', [BackendController::class, 'bookings']);
Route::get('/bookings/create', [CommonController::class, 'bookingCreate'])->defaults('layoutContext', 'backend');
Route::get('/bookings/{uniqId}/edit', [BackendController::class, 'bookingEdit'])->whereUuid('uniqId');
Route::get('/reports', [BackendController::class, 'reports']);
Route::get('/settings', [BackendController::class, 'settings']);
Route::get('/google/callback', [GoogleMeetController::class, 'callback']);
Route::get('/google/meet/public-link', [GoogleMeetController::class, 'publicLink']);
