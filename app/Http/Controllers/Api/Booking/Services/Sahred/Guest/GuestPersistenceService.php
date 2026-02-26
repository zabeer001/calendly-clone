<?php

namespace App\Http\Controllers\Api\Booking\Services\Sahred\Guest;

use App\Models\Guest;

class GuestPersistenceService implements GuestStorePersistenceInterface, GuestUpdatePersistenceInterface
{
    public function persistForStore(array $validated): array
    {
        return $this->upsertGuests($validated['guests']);
    }

    public function persistForUpdate(array $validated): ?array
    {
        if (! array_key_exists('guests', $validated)) {
            return null;
        }

        return $this->upsertGuests($validated['guests']);
    }

    private function upsertGuests(array $guests): array
    {
        $guestIds = [];

        foreach ($guests as $guestData) {
            $guest = Guest::query()->firstOrNew([
                'email' => $guestData['email'],
            ]);

            $guest->name = $guestData['name'];
            $guest->phone = $guestData['phone'] ?? null;
            $guest->save();

            $guestIds[] = $guest->id;
        }

        return array_values(array_unique($guestIds));
    }
}
