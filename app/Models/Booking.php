<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Str;

class Booking extends Model
{
    protected static function booted(): void
    {
        static::creating(function (self $booking): void {
            if (empty($booking->uniq_id)) {
                $booking->uniq_id = (string) Str::uuid();
            }
        });
    }

    protected $fillable = [
        'uniq_id',
        'host_user_id',
        'event_type',
        'title',
        'timezone',
        'start_at',
        'end_at',
        'duration_minutes',
        'status',
        'notes',
        'cancel_reason',
        'cancelled_at',
    ];

    public function getRouteKeyName(): string
    {
        return 'uniq_id';
    }

    public function guests(): BelongsToMany
    {
        return $this->belongsToMany(Guest::class, 'booking_guest')
            ->withTimestamps();
    }
}
