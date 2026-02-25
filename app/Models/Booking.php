<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    protected $fillable = [
        'host_user_id',
        'event_type',
        'title',
        'guest_name',
        'guest_email',
        'guest_phone',
        'timezone',
        'start_at',
        'end_at',
        'duration_minutes',
        'status',
        'notes',
        'cancel_reason',
        'cancelled_at',
    ];
}
