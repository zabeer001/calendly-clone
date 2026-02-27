<?php

namespace App\Http\Controllers\Api\Booking\Services\Delete;

use App\Models\Booking;
use Illuminate\Http\JsonResponse;

class BookingDeleteService
{
    public function handle(Booking $booking): JsonResponse
    {
        $booking->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Booking deleted successfully.',
        ]);
    }
}
