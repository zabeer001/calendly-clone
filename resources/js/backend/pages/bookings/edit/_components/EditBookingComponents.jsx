import React from 'react';
import EditBookingHeader from './EditBookingHeader';
import EditBookingError from './EditBookingError';
import EditBookingForm from './EditBookingForm';

export default function EditBookingComponents({ bookingId }) {
    return (
        <div className="mx-auto max-w-4xl space-y-6">
            <section className="rounded-2xl border border-base-300/60 bg-base-100/75 p-8 shadow-xl backdrop-blur-lg">
                <EditBookingHeader />
                <EditBookingError />
                <EditBookingForm bookingId={bookingId} />
            </section>
        </div>
    );
}
