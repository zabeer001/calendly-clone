<?php

namespace App\Http\Controllers\Api\Booking\Services;

use App\Models\Booking;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class BookingStoreService
{
    public function handle(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'host_user_id' => ['nullable', 'integer', 'exists:users,id'],
            'event_type' => ['required', 'string', 'max:120'],
            'title' => ['required', 'string', 'max:160'],
            'guest_name' => ['required', 'string', 'max:120'],
            'guest_email' => ['required', 'email', 'max:255'],
            'guest_phone' => ['nullable', 'string', 'max:30'],
            'timezone' => ['required', 'string', 'max:80'],
            'start_at' => ['required', 'date'],
            'end_at' => ['nullable', 'date', 'after:start_at'],
            'duration_minutes' => ['nullable', 'integer', 'min:15', 'max:240'],
            'status' => ['sometimes', Rule::in(['pending', 'confirmed', 'cancelled', 'completed'])],
            'notes' => ['nullable', 'string', 'max:2000'],
            'cancel_reason' => ['nullable', 'string', 'max:2000'],
            'cancelled_at' => ['nullable', 'date'],
        ]);

        if (($validated['status'] ?? null) === 'cancelled' && empty($validated['cancelled_at'])) {
            $validated['cancelled_at'] = now();
        }

        $booking = new Booking();
        $booking->forceFill($validated)->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Booking created successfully.',
            'data' => $booking,
        ], 201);
    }
}
