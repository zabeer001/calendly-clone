<?php

namespace Database\Seeders;

use App\Models\Booking;
use App\Models\Guest;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class BookingSeeder extends Seeder
{
    /**
     * Seed the application's bookings table.
     */
    public function run(): void
    {
        $host = User::whereIn('role', ['admin', 'superadmin'])->first() ?? User::first();

        $baseStart = Carbon::now()->startOfHour()->addDay();

        $bookings = [
            [
                'host_user_id' => $host?->id,
                'event_type' => 'Discovery Call',
                'title' => 'Project Discovery Session',
                'guests' => [
                    [
                        'name' => 'Alice Johnson',
                        'email' => 'alice.johnson@example.com',
                        'phone' => '+1-202-555-0110',
                    ],
                ],
                'timezone' => 'America/New_York',
                'start_at' => $baseStart->copy(),
                'end_at' => $baseStart->copy()->addMinutes(30),
                'duration_minutes' => 30,
                'status' => 'confirmed',
                'notes' => 'First meeting to discuss project goals.',
                'cancel_reason' => null,
                'cancelled_at' => null,
            ],
            [
                'host_user_id' => $host?->id,
                'event_type' => 'Technical Interview',
                'title' => 'Backend Engineer Interview',
                'guests' => [
                    [
                        'name' => 'Bob Smith',
                        'email' => 'bob.smith@example.com',
                        'phone' => '+1-202-555-0139',
                    ],
                ],
                'timezone' => 'America/Chicago',
                'start_at' => $baseStart->copy()->addHours(2),
                'end_at' => $baseStart->copy()->addHours(3),
                'duration_minutes' => 60,
                'status' => 'pending',
                'notes' => 'Candidate requested reschedule possibility.',
                'cancel_reason' => null,
                'cancelled_at' => null,
            ],
            [
                'host_user_id' => $host?->id,
                'event_type' => 'Consultation',
                'title' => 'Business Consultation',
                'guests' => [
                    [
                        'name' => 'Charlie Brown',
                        'email' => 'charlie.brown@example.com',
                        'phone' => null,
                    ],
                ],
                'timezone' => 'America/Los_Angeles',
                'start_at' => $baseStart->copy()->subDay(),
                'end_at' => $baseStart->copy()->subDay()->addMinutes(45),
                'duration_minutes' => 45,
                'status' => 'completed',
                'notes' => 'Shared pricing and timeline details.',
                'cancel_reason' => null,
                'cancelled_at' => null,
            ],
            [
                'host_user_id' => $host?->id,
                'event_type' => 'Support Session',
                'title' => 'Urgent Support Call',
                'guests' => [
                    [
                        'name' => 'Diana Prince',
                        'email' => 'diana.prince@example.com',
                        'phone' => '+1-202-555-0147',
                    ],
                ],
                'timezone' => 'America/New_York',
                'start_at' => $baseStart->copy()->addDays(2),
                'end_at' => $baseStart->copy()->addDays(2)->addMinutes(30),
                'duration_minutes' => 30,
                'status' => 'cancelled',
                'notes' => 'Customer had a conflict.',
                'cancel_reason' => 'Client cancelled due to scheduling conflict.',
                'cancelled_at' => Carbon::now()->subHours(3),
            ],
            [
                'host_user_id' => $host?->id,
                'event_type' => 'Demo',
                'title' => 'Product Demo',
                'guests' => [
                    [
                        'name' => 'Ethan Hunt',
                        'email' => 'ethan.hunt@example.com',
                        'phone' => '+1-202-555-0177',
                    ],
                ],
                'timezone' => 'Europe/London',
                'start_at' => $baseStart->copy()->addDays(3),
                'end_at' => $baseStart->copy()->addDays(3)->addMinutes(45),
                'duration_minutes' => 45,
                'status' => 'confirmed',
                'notes' => 'Requested recording of the session.',
                'cancel_reason' => null,
                'cancelled_at' => null,
            ],
        ];

        foreach ($bookings as $booking) {
            $guestDataList = $booking['guests'];
            unset($booking['guests']);

            $bookingModel = Booking::updateOrCreate(
                [
                    'title' => $booking['title'],
                    'start_at' => $booking['start_at'],
                ],
                $booking
            );

            $guestIds = [];
            foreach ($guestDataList as $guestData) {
                $guest = Guest::updateOrCreate(
                    ['email' => $guestData['email']],
                    $guestData
                );
                $guestIds[] = $guest->id;
            }

            $bookingModel->guests()->sync($guestIds);
        }
    }
}
