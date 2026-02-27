<?php

namespace App\Http\Controllers\Api\Booking\Services\Show;

use App\Models\Booking;
use Illuminate\Http\JsonResponse;

class BookingShowService
{
    public function handle(Booking $booking): JsonResponse
    {
        // return 0;
        $booking->load('guests');

        return response()->json([
            'status' => 'success',
            'data' => $booking,
        ]);
    }
}
