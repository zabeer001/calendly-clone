<?php

namespace App\Http\Controllers\Api\Booking\Services\Store;

use Illuminate\Support\Carbon;

class BookingMeetPayloadBuilder
{
    public function build(array $validated): array
    {
        $timezone = (string) ($validated['timezone'] ?? config('app.timezone', 'UTC'));
        $startAt = (string) $validated['start_at'];

        $durationMinutes = (int) ($validated['duration_minutes'] ?? 0);

        if ($durationMinutes <= 0 && ! empty($validated['end_at'])) {
            $start = Carbon::parse($startAt, $timezone);
            $end = Carbon::parse((string) $validated['end_at'], $timezone);
            $durationMinutes = max(1, $start->diffInMinutes($end));
        }

        if ($durationMinutes <= 0) {
            $durationMinutes = 30;
        }

        return [
            'title' => $validated['title'],
            'description' => $validated['notes'] ?? null,
            'start_at' => $startAt,
            'duration_minutes' => $durationMinutes,
            'timezone' => $timezone,
            'attendees' => collect($validated['guests'] ?? [])
                ->map(fn (array $guest) => ['email' => $guest['email']])
                ->values()
                ->all(),
        ];
    }
}
