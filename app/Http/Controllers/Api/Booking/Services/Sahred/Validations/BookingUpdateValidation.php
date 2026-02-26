<?php

namespace App\Http\Controllers\Api\Booking\Services\Sahred\Validations;

use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class BookingUpdateValidation
{
    public function validate(Request $request): array
    {
        return $request->validate([
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
    }
}
