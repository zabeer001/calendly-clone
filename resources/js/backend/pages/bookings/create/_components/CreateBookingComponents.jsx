import React from 'react';
import CreateBookingHeader from './CreateBookingHeader';
import CreateBookingError from './CreateBookingError';
import CreateBookingForm from './CreateBookingForm';

export default function CreateBookingComponents() {
    return (
        <div className="mx-auto max-w-6xl space-y-6">
            <section className="rounded-2xl border border-base-300/60 bg-base-100/75 p-8 shadow-xl backdrop-blur-lg">
                <CreateBookingHeader />
                <CreateBookingError />
                <CreateBookingForm />
            </section>
        </div>
    );
}

export { CreateBookingHeader, CreateBookingError, CreateBookingForm };
