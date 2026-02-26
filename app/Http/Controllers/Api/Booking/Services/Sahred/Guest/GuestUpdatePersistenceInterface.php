<?php

namespace App\Http\Controllers\Api\Booking\Services\Sahred\Guest;

use App\Models\Booking;

interface GuestUpdatePersistenceInterface
{
    public function persistForUpdate(array $validated, Booking $booking): ?int;
}
