<?php

namespace App\Http\Controllers\Api\Booking\Services\Update;

use App\Models\Booking;
use App\Http\Controllers\Api\Booking\Services\Update\Validations\BookingUpdateValidation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BookingUpdateService
{
    public function __construct(
        private BookingUpdatePersistence $bookingUpdatePersistence,
        private BookingUpdateValidation $bookingUpdateValidation
    ) {}

    public function handle(Request $request, Booking $booking): JsonResponse
    {
        $validated = $this->bookingUpdateValidation->validate($request);

        if (array_key_exists('end_at', $validated) && ! empty($validated['end_at'])) {
            $startAt = $validated['start_at'] ?? $booking->start_at;

            if (strtotime((string) $validated['end_at']) <= strtotime((string) $startAt)) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'The end_at field must be a date after start_at.',
                ], 422);
            }
        }

        $booking = $this->bookingUpdatePersistence->update($booking, $validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Booking updated successfully.',
            'data' => $booking,
        ]);
    }
}
