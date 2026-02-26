<?php

namespace App\Http\Controllers\Api\Booking\Services\Sahred\Guest;

interface GuestStorePersistenceInterface
{
    public function persistForStore(array $validated): array;
}
