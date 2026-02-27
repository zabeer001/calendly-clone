<?php

namespace App\Http\Controllers\Api\Booking\Services\Update;

use App\Http\Controllers\Api\Booking\Services\Sahred\Guest\GuestUpdatePersistenceInterface;
use App\Models\Booking;
use Illuminate\Support\Facades\DB;

class BookingUpdatePersistence
{
    public function __construct(
        private GuestUpdatePersistenceInterface $guestPersistence
    ) {}

    public function update(Booking $booking, array $validated): Booking
    {
        return DB::transaction(function () use ($validated, $booking): Booking {
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
    }
}
