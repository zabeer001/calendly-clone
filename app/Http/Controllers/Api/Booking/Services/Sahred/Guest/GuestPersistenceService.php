<?php

namespace App\Http\Controllers\Api\Booking\Services\Sahred\Guest;

use App\Models\Booking;
use App\Models\Guest;
use Illuminate\Validation\ValidationException;

class GuestPersistenceService implements GuestStorePersistenceInterface, GuestUpdatePersistenceInterface
{
    public function persistForStore(array $validated): int
    {
        $guest = Guest::query()->firstOrNew([
            'email' => $validated['guest_email'],
        ]);

        $guest->name = $validated['guest_name'];
        $guest->phone = $validated['guest_phone'] ?? null;
        $guest->save();

        return $guest->id;
    }

    public function persistForUpdate(array $validated, Booking $booking): ?int
    {
        $hasGuestInput = array_key_exists('guest_name', $validated)
            || array_key_exists('guest_email', $validated)
            || array_key_exists('guest_phone', $validated);

        if (! $hasGuestInput) {
            return null;
        }

        $existingGuestId = is_array($booking->guest_ids) ? ($booking->guest_ids[0] ?? null) : null;
        $existingGuest = $existingGuestId ? Guest::find($existingGuestId) : null;

        $email = $validated['guest_email'] ?? $existingGuest?->email;
        if (empty($email)) {
            throw ValidationException::withMessages([
                'guest_email' => ['The guest_email field is required when updating guest details.'],
            ]);
        }

        $guest = Guest::query()->firstOrNew(['email' => $email]);
        $guest->name = $validated['guest_name'] ?? $existingGuest?->name ?? 'Guest';
        $guest->phone = array_key_exists('guest_phone', $validated)
            ? $validated['guest_phone']
            : $existingGuest?->phone;
        $guest->save();

        return $guest->id;
    }
}
