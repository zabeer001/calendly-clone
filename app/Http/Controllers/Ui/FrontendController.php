<?php

namespace App\Http\Controllers\Ui;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class FrontendController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('home/HomePage');
    }

    public function signIn(): Response
    {
        return Inertia::render('auth/SignInPage');
    }
}
