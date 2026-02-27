<?php

namespace App\Http\Controllers\Api\Booking\Services\Store;

use App\Http\Controllers\Api\Booking\Services\Sahred\Guest\GuestStorePersistenceInterface;
use App\Models\Booking;
use Illuminate\Support\Facades\DB;

class BookingStorePersistence
{
    public function __construct(
        private GuestStorePersistenceInterface $guestPersistence
    ) {}

    public function create(array $validated): Booking
    {
        return DB::transaction(function () use ($validated): Booking {
            $guestIds = $this->guestPersistence->persistForStore($validated);

            if (($validated['status'] ?? null) === 'cancelled' && empty($validated['cancelled_at'])) {
                $validated['cancelled_at'] = now();
            }

            unset($validated['guests']);

            $booking = new Booking();
            $booking->host_user_id = $validated['host_user_id'] ?? null;
            $booking->event_type = $validated['event_type'];
            $booking->title = $validated['title'];
            $booking->timezone = $validated['timezone'];
            $booking->start_at = $validated['start_at'];
            $booking->end_at = $validated['end_at'] ?? null;
            $booking->duration_minutes = $validated['duration_minutes'] ?? null;
            $booking->status = $validated['status'] ?? 'pending';
            $booking->notes = $validated['notes'] ?? null;
            $booking->cancel_reason = $validated['cancel_reason'] ?? null;
            $booking->cancelled_at = $validated['cancelled_at'] ?? null;
            $booking->save();
            $booking->guests()->sync($guestIds);

            return $booking;
        });
    }
}
