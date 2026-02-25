<?php

namespace App\Http\Controllers\Api\Booking\Services;

use App\Models\Booking;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class BookingUpdateService
{
    public function handle(Request $request, Booking $booking): JsonResponse
    {
        $validated = $request->validate([
            'host_user_id' => ['sometimes', 'nullable', 'integer', 'exists:users,id'],
            'event_type' => ['sometimes', 'required', 'string', 'max:120'],
            'title' => ['sometimes', 'required', 'string', 'max:160'],
            'guest_name' => ['sometimes', 'required', 'string', 'max:120'],
            'guest_email' => ['sometimes', 'required', 'email', 'max:255'],
            'guest_phone' => ['sometimes', 'nullable', 'string', 'max:30'],
            'timezone' => ['sometimes', 'required', 'string', 'max:80'],
            'start_at' => ['sometimes', 'required', 'date'],
            'end_at' => ['sometimes', 'nullable', 'date'],
            'duration_minutes' => ['sometimes', 'nullable', 'integer', 'min:15', 'max:240'],
            'status' => ['sometimes', Rule::in(['pending', 'confirmed', 'cancelled', 'completed'])],
            'notes' => ['sometimes', 'nullable', 'string', 'max:2000'],
            'cancel_reason' => ['sometimes', 'nullable', 'string', 'max:2000'],
            'cancelled_at' => ['sometimes', 'nullable', 'date'],
        ]);

        if (($validated['status'] ?? null) === 'cancelled' && empty($validated['cancelled_at'])) {
            $validated['cancelled_at'] = now();
        }

        if (array_key_exists('end_at', $validated) && ! empty($validated['end_at'])) {
            $startAt = $validated['start_at'] ?? $booking->start_at;

            if (strtotime((string) $validated['end_at']) <= strtotime((string) $startAt)) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'The end_at field must be a date after start_at.',
                ], 422);
            }
        }

        $booking->forceFill($validated)->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Booking updated successfully.',
            'data' => $booking,
        ]);
    }
}
