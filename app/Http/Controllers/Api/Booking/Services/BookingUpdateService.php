<?php

namespace App\Http\Controllers\Api\Booking\Services;

use App\Models\Booking;
use App\Http\Controllers\Api\Booking\Services\Sahred\Guest\GuestUpdatePersistenceInterface;
use App\Http\Controllers\Api\Booking\Services\Sahred\Validations\BookingUpdateValidation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BookingUpdateService
{
    public function __construct(
        private GuestUpdatePersistenceInterface $guestPersistence,
        private BookingUpdateValidation $bookingUpdateValidation
    )
    {
    }

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

        $booking = DB::transaction(function () use ($validated, $booking): Booking {
            $guestIds = $this->guestPersistence->persistForUpdate($validated);

            if (($validated['status'] ?? null) === 'cancelled' && empty($validated['cancelled_at'])) {
                $validated['cancelled_at'] = now();
            }

            unset($validated['guests']);

            if (array_key_exists('host_user_id', $validated)) {
                $booking->host_user_id = $validated['host_user_id'];
            }
            if (array_key_exists('event_type', $validated)) {
                $booking->event_type = $validated['event_type'];
            }
            if (array_key_exists('title', $validated)) {
                $booking->title = $validated['title'];
            }
            if (array_key_exists('timezone', $validated)) {
                $booking->timezone = $validated['timezone'];
            }
            if (array_key_exists('start_at', $validated)) {
                $booking->start_at = $validated['start_at'];
            }
            if (array_key_exists('end_at', $validated)) {
                $booking->end_at = $validated['end_at'];
            }
            if (array_key_exists('duration_minutes', $validated)) {
                $booking->duration_minutes = $validated['duration_minutes'];
            }
            if (array_key_exists('status', $validated)) {
                $booking->status = $validated['status'];
            }
            if (array_key_exists('notes', $validated)) {
                $booking->notes = $validated['notes'];
            }
            if (array_key_exists('cancel_reason', $validated)) {
                $booking->cancel_reason = $validated['cancel_reason'];
            }
            if (array_key_exists('cancelled_at', $validated)) {
                $booking->cancelled_at = $validated['cancelled_at'];
            }
            $booking->save();
            if ($guestIds !== null) {
                $booking->guests()->sync($guestIds);
            }

            return $booking;
        });

        return response()->json([
            'status' => 'success',
            'message' => 'Booking updated successfully.',
            'data' => $booking,
        ]);
    }
}
