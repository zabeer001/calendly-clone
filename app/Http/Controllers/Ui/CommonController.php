<?php

namespace App\Http\Controllers\Ui;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CommonController extends Controller
{
    public function bookingCreate(Request $request): Response
    {
        return Inertia::render('common/booking/create/CreateBookingPage', [
            'layoutContext' => (string) $request->route('layoutContext', 'frontend'),
        ]);
    }
}
