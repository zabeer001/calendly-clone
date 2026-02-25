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

    public function users(): Response
    {
        return Inertia::render('users/UsersPage');
    }

    public function bookings(): Response
    {
        return Inertia::render('bookings/BookingsPage');
    }

    public function reports(): Response
    {
        return Inertia::render('reports/ReportsPage');
    }

    public function settings(): Response
    {
        return Inertia::render('settings/SettingsPage');
    }
}
