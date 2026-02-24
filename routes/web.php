<?php

use App\Http\Controllers\Ui\BackendController;
use App\Http\Controllers\Ui\FrontendController;
use Illuminate\Support\Facades\Route;

Route::get('/', [FrontendController::class, 'index']);



Route::get('/dashbaord', [BackendController::class, 'index']);
