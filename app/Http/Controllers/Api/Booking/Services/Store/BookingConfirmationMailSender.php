<?php

namespace App\Http\Controllers\Api\Booking\Services\Store;

use Illuminate\Support\Facades\Mail;

class BookingConfirmationMailSender
{
    public function send(array $validated, array $meetData): void
    {
        $emails = collect($validated['guests'] ?? [])
            ->pluck('email')
            ->filter(fn (mixed $email) => is_string($email) && $email !== '')
            ->unique()
            ->values()
            ->all();

        if ($emails === []) {
            return;
        }

        $toEmail = (string) $emails[0];
        $ccEmails = array_values(array_slice($emails, 1));

        $meetLink = trim((string) ($meetData['meet_link'] ?? ''));

        $subject = 'Booking Confirmation: '.(string) $validated['title'];

        $bodyLines = [
            'Your booking has been confirmed.',
            'Title: '.(string) $validated['title'],
            'Event Type: '.(string) $validated['event_type'],
            'Start Time: '.(string) $validated['start_at'],
            'Timezone: '.(string) ($validated['timezone'] ?? config('app.timezone', 'UTC')),
            'Meeting Link: '.($meetLink !== '' ? $meetLink : 'Not available'),
        ];

        if (! empty($validated['notes'])) {
            $bodyLines[] = 'Notes: '.(string) $validated['notes'];
        }

        $body = implode("\n", $bodyLines);

        Mail::raw($body, function ($message) use ($toEmail, $ccEmails, $subject): void {
            $message->to($toEmail)->subject($subject);

            if ($ccEmails !== []) {
                $message->cc($ccEmails);
            }
        });
    }
}
