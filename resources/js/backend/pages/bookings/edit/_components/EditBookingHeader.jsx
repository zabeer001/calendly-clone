import React from 'react';
import { Link } from '@inertiajs/react';

export default function EditBookingHeader() {
    return (
        <div className="mb-6 flex items-center justify-between">
            <h1 className="text-3xl font-extrabold">Edit Booking</h1>
            <Link href="/bookings" className="btn btn-sm btn-outline">
                Back
            </Link>
        </div>
    );
}
