<?php

namespace App\Http\Controllers\Api\Booking\Services\Store\Validations;

use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class BookingStoreValidation
{
    public function validate(Request $request): array
    {
        return $request->validate([
            'host_user_id' => ['nullable', 'integer', 'exists:users,id'],
            'event_type' => ['required', 'string', 'max:120'],
            'title' => ['required', 'string', 'max:160'],
            'guests' => ['required', 'array', 'min:1'],
            'guests.*.name' => ['required', 'string', 'max:120'],
            'guests.*.email' => ['required', 'email', 'max:255'],
            'guests.*.phone' => ['nullable', 'string', 'max:30'],
            'timezone' => ['required', 'string', 'max:80'],
            'start_at' => ['required', 'date'],
            'end_at' => ['nullable', 'date', 'after:start_at'],
            'duration_minutes' => ['nullable', 'integer', 'min:15', 'max:240'],
            'status' => ['sometimes', Rule::in(['pending', 'confirmed', 'cancelled', 'completed'])],
            'notes' => ['nullable', 'string', 'max:2000'],
            'cancel_reason' => ['nullable', 'string', 'max:2000'],
            'cancelled_at' => ['nullable', 'date'],
        ]);
    }
}
