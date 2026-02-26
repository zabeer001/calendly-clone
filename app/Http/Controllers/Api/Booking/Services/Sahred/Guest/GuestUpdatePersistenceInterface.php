<?php

namespace App\Http\Controllers\Api\Booking\Services\Sahred\Guest;

interface GuestUpdatePersistenceInterface
{
    public function persistForUpdate(array $validated): ?array;
}
