<?php

namespace App\Http\Controllers\Api\Booking\Services\Index;

use App\Models\Booking;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BookingIndexService
{
    public function handle(Request $request): JsonResponse
    {
        $query = Booking::query()->with(['guests:id,email'])->latest();

        if ($request->filled('search')) {
            $search = trim((string) $request->string('search'));

            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('event_type', 'like', "%{$search}%")
                    ->orWhereHas('guests', function ($guestQuery) use ($search) {
                        $guestQuery->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    });

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
            $guestEmail = (string) $request->string('guest_email');
            $query->whereHas('guests', function ($guestQuery) use ($guestEmail) {
                $guestQuery->where('email', $guestEmail);
            });
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
