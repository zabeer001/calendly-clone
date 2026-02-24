<?php

namespace App\Http\Controllers\Ui;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class BackendController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('dashbaord/DashBoardPage');
    }
}
