import React from 'react';
import { usePage } from '@inertiajs/react';
import EditBookingComponents from './_components/EditBookingComponents';

export default function EditBookingPage() {
    const { bookingId } = usePage().props;

    return <EditBookingComponents bookingId={bookingId} />;
}
