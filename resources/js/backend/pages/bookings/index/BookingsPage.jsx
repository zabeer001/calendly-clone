import React, { useEffect, useMemo, useState } from 'react';
import { Link } from '@inertiajs/react';
import {
    deleteBooking,
    fetchBookings,
    getApiErrorMessage,
} from '../api/bookingApi';

function BookingsPage() {
    const userRole = useMemo(() => localStorage.getItem('role') || 'user', []);
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [searchText, setSearchText] = useState('');

    const loadBookings = async ({ status = '', search = '' } = {}) => {
        setIsLoading(true);
        setError('');

        try {
            const list = await fetchBookings({ status, search });
            setBookings(list);
        } catch (err) {
            setError(getApiErrorMessage(err, 'Failed to load bookings.'));
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);

        if (params.get('created') === '1') {
            setMessage('Booking created successfully.');
        }

        if (params.get('updated') === '1') {
            setMessage('Booking updated successfully.');
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            loadBookings({ status: filterStatus, search: searchText.trim() });
        }, 300);

        return () => clearTimeout(timer);
    }, [filterStatus, searchText]);

    const onFilter = (e) => {
        const value = e.target.value;
        setFilterStatus(value);
    };

    const onDelete = async (id) => {
        const ok = window.confirm('Delete this booking?');
        if (!ok) {
            return;
        }

        setError('');
        setMessage('');

        try {
            const response = await deleteBooking(id);
            setMessage(response?.message || 'Booking deleted successfully.');
            await loadBookings({ status: filterStatus, search: searchText.trim() });
        } catch (err) {
            setError(getApiErrorMessage(err, 'Failed to delete booking.'));
        }
    };

    return (
        <div className="mx-auto max-w-7xl space-y-6">
            <section className="rounded-2xl border border-base-300/60 bg-base-100/75 p-6 shadow-xl backdrop-blur-lg">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <h1 className="text-3xl font-extrabold">Bookings</h1>
                        <p className="mt-2 text-sm text-base-content/70">
                            Track and manage booking records from this page. Signed in as: <span className="font-semibold uppercase">{userRole}</span>
                        </p>
                    </div>
                    <Link href="/bookings/create" className="btn btn-success">Create Booking</Link>
                </div>
            </section>

            <section className="rounded-2xl border border-base-300/60 bg-base-100/75 p-6 shadow-xl backdrop-blur-lg">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <h2 className="text-xl font-bold">Booking List</h2>
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            className="input input-bordered input-sm w-72 bg-base-100 text-base-content placeholder:text-base-content/60"
                            placeholder="Search by ID, name, email, or YYYY-MM-DD"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                        <select className="select select-bordered select-sm" value={filterStatus} onChange={onFilter}>
                            <option value="">All status</option>
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>
                </div>

                {message ? <p className="mb-3 text-sm text-success">{message}</p> : null}
                {error ? <p className="mb-3 text-sm text-error">{error}</p> : null}
                {isLoading ? <p className="text-sm text-base-content/70">Loading bookings...</p> : null}

                {!isLoading ? (
                    <div className="overflow-x-auto rounded-xl border border-base-300/60">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Guest</th>
                                    <th>Start</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="text-center text-base-content/70">No bookings found.</td>
                                    </tr>
                                ) : (
                                    bookings.map((booking) => (
                                        <tr key={booking.id}>
                                            <td>{booking.title}</td>
                                            <td>
                                                <div className="text-xs text-base-content/60">
                                                    {(booking.guests || []).map((guest) => guest.email).join(', ') || '-'}
                                                </div>
                                            </td>
                                            <td>{new Date(booking.start_at).toLocaleString()}</td>
                                            <td className="uppercase">{booking.status}</td>
                                            <td>
                                                <div className="flex gap-2">
                                                    <Link href={`/bookings/${booking.uniq_id || booking.id}/edit`} className="btn btn-xs btn-outline">Edit</Link>
                                                    <button type="button" className="btn btn-xs btn-error btn-outline" onClick={() => onDelete(booking.id)}>Delete</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                ) : null}
            </section>
        </div>
    );
}

export default BookingsPage;
