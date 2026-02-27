<?php

namespace App\Http\Controllers\Api\Booking\Services\Store;

use Throwable;
use App\Services\GoogleMeet\GoogleMeetService;
use App\Http\Controllers\Api\Booking\Services\Store\Validations\BookingStoreValidation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class BookingStoreService
{
    public function __construct(
        private BookingStorePersistence $bookingStorePersistence,
        private BookingStoreValidation $bookingStoreValidation,
        private GoogleMeetService $googleMeetService,
        private BookingMeetPayloadBuilder $bookingMeetPayloadBuilder,
        private BookingConfirmationMailSender $bookingConfirmationMailSender
    ) {}

    public function handle(Request $request): JsonResponse
    {
        $validated = $this->bookingStoreValidation->validate($request);

        $booking = $this->bookingStorePersistence->create($validated);

        $meetPayload = $this->bookingMeetPayloadBuilder->build($validated);
        $meetData = [
            'meet_link' => null,
            'calendar_link' => null,
            'event_id' => null,
        ];
        $googleMeetError = null;

        try {
            $meetData = $this->googleMeetService->createMeetLink($meetPayload);
        } catch (Throwable $e) {
            $googleMeetError = $e->getMessage();
            Log::error('Google Meet link generation failed.', [
                'error' => $googleMeetError,
                'booking_title' => $validated['title'] ?? null,
                'start_at' => $validated['start_at'] ?? null,
            ]);
        }

        try {
            $this->bookingConfirmationMailSender->send($validated, $meetData);
        } catch (Throwable $e) {
            // Booking should still be created even if mail sending fails.
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Booking created successfully.',
            'data' => [
                ...$booking->toArray(),
                'google_meet_link' => $meetData['meet_link'],
                'google_calendar_link' => $meetData['calendar_link'],
                'google_meet_event_id' => $meetData['event_id'],
                'google_meet_error' => $googleMeetError,
            ],
        ], 201);
    }

}
