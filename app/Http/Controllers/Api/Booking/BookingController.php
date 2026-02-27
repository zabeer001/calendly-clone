<?php

namespace App\Http\Controllers\Api\Booking;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Api\Booking\Services\Delete\BookingDeleteService;
use App\Http\Controllers\Api\Booking\Services\Index\BookingIndexService;
use App\Http\Controllers\Api\Booking\Services\Show\BookingShowService;
use App\Http\Controllers\Api\Booking\Services\Store\BookingStoreService;
use App\Http\Controllers\Api\Booking\Services\Update\BookingUpdateService;
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
