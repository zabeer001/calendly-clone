<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class BookingController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Booking::query()->latest();

        if ($request->filled('status')) {
            $query->where('status', $request->string('status'));
        }

        if ($request->filled('guest_email')) {
            $query->where('guest_email', $request->string('guest_email'));
        }

        if ($request->filled('date_from')) {
            $query->whereDate('start_at', '>=', $request->string('date_from'));
        }

        if ($request->filled('date_to')) {
            $query->whereDate('start_at', '<=', $request->string('date_to'));
        }

        $bookings = $query->paginate(15);

        return response()->json([
            'status' => 'success',
            'data' => $bookings,
        ]);
    }

    public function store(Request $request): JsonResponse
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
            'end_at' => ['required', 'date', 'after:start_at'],
            'duration_minutes' => ['required', 'integer', 'min:15', 'max:240'],
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

    public function show(Booking $booking): JsonResponse
    {
        return response()->json([
            'status' => 'success',
            'data' => $booking,
        ]);
    }

    public function update(Request $request, Booking $booking): JsonResponse
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
            'end_at' => ['sometimes', 'required', 'date'],
            'duration_minutes' => ['sometimes', 'required', 'integer', 'min:15', 'max:240'],
            'status' => ['sometimes', Rule::in(['pending', 'confirmed', 'cancelled', 'completed'])],
            'notes' => ['sometimes', 'nullable', 'string', 'max:2000'],
            'cancel_reason' => ['sometimes', 'nullable', 'string', 'max:2000'],
            'cancelled_at' => ['sometimes', 'nullable', 'date'],
        ]);

        if (($validated['status'] ?? null) === 'cancelled' && empty($validated['cancelled_at'])) {
            $validated['cancelled_at'] = now();
        }

        if (array_key_exists('end_at', $validated)) {
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

    public function destroy(Booking $booking): JsonResponse
    {
        $booking->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Booking deleted successfully.',
        ]);
    }
}
