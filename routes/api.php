<?php

use App\Http\Controllers\Api\Auth\AuthController;
use App\Http\Controllers\Api\Booking\BookingController;
use App\Http\Controllers\Api\EmployeeController;
use App\Http\Controllers\Api\User\UserController;
use Illuminate\Support\Facades\Route;

Route::post('signin', [AuthController::class, 'signin']);
Route::post('refresh', [AuthController::class, 'refresh']);
Route::post('signout', [AuthController::class, 'signout']);

// Public endpoint for guest booking creation (Calendly-style)
Route::post('bookings', [BookingController::class, 'store']);

Route::apiResource('users', UserController::class);
Route::apiResource('employees', EmployeeController::class);
Route::apiResource('bookings', BookingController::class)->except(['store']);
