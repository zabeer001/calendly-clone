import React, { useMemo } from 'react';

function BookingsPage() {
    const userRole = useMemo(() => localStorage.getItem('role') || 'user', []);

    return (
        <div className="mx-auto max-w-7xl">
            <section className="rounded-2xl border border-base-300/60 bg-base-100/75 p-6 shadow-xl backdrop-blur-lg">
                <h1 className="text-3xl font-extrabold">Bookings</h1>
                <p className="mt-2 text-sm text-base-content/70">
                    Track and manage booking records from this page. Signed in as: <span className="font-semibold uppercase">{userRole}</span>
                </p>
            </section>
        </div>
    );
}

export default BookingsPage;
