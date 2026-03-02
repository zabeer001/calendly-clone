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

    public function userCreate(): Response
    {
        return Inertia::render('users/CreateUserPage');
    }

    public function userShow(int $user): Response
    {
        return Inertia::render('users/ShowUserPage', [
            'userId' => $user,
        ]);
    }

    public function userEdit(int $user): Response
    {
        return Inertia::render('users/EditUserPage', [
            'userId' => $user,
        ]);
    }

    public function bookings(): Response
    {
        return Inertia::render('bookings/index/BookingsPage');
    }

    public function bookingEdit(string $uniqId): Response
    {
        return Inertia::render('bookings/edit/EditBookingPage', [
            'bookingId' => $uniqId,
        ]);
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
