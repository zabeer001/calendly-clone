<?php

namespace App\Http\Controllers\Api\Booking\Services;

use App\Models\Booking;
use Throwable;
use App\Services\GoogleMeet\GoogleMeetService;
use App\Http\Controllers\Api\Booking\Services\Sahred\Guest\GuestStorePersistenceInterface;
use App\Http\Controllers\Api\Booking\Services\Sahred\Validations\BookingStoreValidation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BookingStoreService
{
    public function __construct(
        private GuestStorePersistenceInterface $guestPersistence,
        private BookingStoreValidation $bookingStoreValidation,
        private GoogleMeetService $googleMeetService
    ) {}

    public function handle(Request $request): JsonResponse
    {
        $validated = $this->bookingStoreValidation->validate($request);

        $booking = DB::transaction(function () use ($validated): Booking {
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

        $meetPayload = $this->buildMeetPayload($validated);
        $meetData = [
            'meet_link' => null,
            'calendar_link' => null,
            'event_id' => null,
        ];

        try {
            $meetData = $this->googleMeetService->createMeetLink($meetPayload);
        } catch (Throwable $e) {
            // Booking should still be created even if Google API fails.
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Booking created successfully.',
            'data' => [
                ...$booking->toArray(),
                'google_meet_link' => $meetData['meet_link'],
                'google_calendar_link' => $meetData['calendar_link'],
                'google_meet_event_id' => $meetData['event_id'],
            ],
        ], 201);
    }

    private function buildMeetPayload(array $validated): array
    {
        return [
            'title' => $validated['title'],
            'description' => $validated['notes'] ?? null,
            'start_at' => now()->addMinutes(2)->toDateTimeString(),
            'duration_minutes' => 10,
            'timezone' => 'Asia/Dhaka',
            'attendees' => collect($validated['guests'] ?? [])
                ->map(fn (array $guest) => ['email' => $guest['email']])
                ->values()
                ->all(),
        ];
    }
}
