<?php

namespace App\Http\Controllers\Api\Booking;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Api\Booking\Services\BookingDeleteService;
use App\Http\Controllers\Api\Booking\Services\BookingIndexService;
use App\Http\Controllers\Api\Booking\Services\BookingShowService;
use App\Http\Controllers\Api\Booking\Services\BookingStoreService;
use App\Http\Controllers\Api\Booking\Services\BookingUpdateService;
use App\Models\Booking;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth:api', 'role:admin,superadmin'])->except('store');
    }

    public function index(Request $request, BookingIndexService $service): JsonResponse
    {
        return $service->handle($request);
    }

    public function store(Request $request, BookingStoreService $service): JsonResponse
    {
        return $service->handle($request);
    }

    public function show(Booking $booking, BookingShowService $service): JsonResponse
    {
        return $service->handle($booking);
    }

    public function update(Request $request, Booking $booking, BookingUpdateService $service): JsonResponse
    {
        return $service->handle($request, $booking);
    }

    public function destroy(Booking $booking, BookingDeleteService $service): JsonResponse
    {
        return $service->handle($booking);
    }
}
