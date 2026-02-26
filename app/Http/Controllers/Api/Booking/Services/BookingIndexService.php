<?php

namespace App\Http\Controllers\Api\Booking\Services;

use App\Models\Booking;
use App\Models\Guest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BookingIndexService
{
    public function handle(Request $request): JsonResponse
    {
        $query = Booking::query()->latest();

        if ($request->filled('search')) {
            $search = trim((string) $request->string('search'));
            $guestIds = Guest::query()
                ->where('name', 'like', "%{$search}%")
                ->orWhere('email', 'like', "%{$search}%")
                ->limit(100)
                ->pluck('id')
                ->all();

            $query->where(function ($q) use ($search, $guestIds) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('event_type', 'like', "%{$search}%");

                if (! empty($guestIds)) {
                    $q->orWhere(function ($guestQuery) use ($guestIds) {
                        foreach ($guestIds as $guestId) {
                            $guestQuery->orWhereJsonContains('guest_ids', $guestId);
                        }
                    });
                }

                if (ctype_digit($search)) {
                    $q->orWhere('id', (int) $search);
                }

                if (preg_match('/^\d{4}-\d{2}-\d{2}$/', $search) === 1) {
                    $q->orWhereDate('start_at', $search);
                }
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->string('status'));
        }

        if ($request->filled('guest_email')) {
            $guestIds = Guest::query()
                ->where('email', (string) $request->string('guest_email'))
                ->pluck('id')
                ->all();

            if (empty($guestIds)) {
                $query->whereRaw('1 = 0');
            } else {
                $query->where(function ($guestQuery) use ($guestIds) {
                    foreach ($guestIds as $guestId) {
                        $guestQuery->orWhereJsonContains('guest_ids', $guestId);
                    }
                });
            }
        }

        if ($request->filled('date_from')) {
            $query->whereDate('start_at', '>=', $request->string('date_from'));
        }

        if ($request->filled('date_to')) {
            $query->whereDate('start_at', '<=', $request->string('date_to'));
        }

        return response()->json([
            'status' => 'success',
            'data' => $query->paginate(10),
        ]);
    }
}
