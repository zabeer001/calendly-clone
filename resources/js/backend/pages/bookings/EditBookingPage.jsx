import React, { useEffect, useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { fetchBookingById, getApiErrorMessage, updateBooking } from './api/bookingApi';

const initialForm = {
    event_type: 'Discovery Call',
    title: '',
    guest_name: '',
    guest_email: '',
    guest_phone: '',
    timezone: 'Asia/Dhaka',
    start_at: '',
    duration_minutes: 30,
    status: 'pending',
    notes: '',
    cancel_reason: '',
};

function toDateTimeLocal(value) {
    if (!value) return '';

    const date = new Date(value);
    const pad = (n) => String(n).padStart(2, '0');

    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export default function EditBookingPage() {
    const { bookingId } = usePage().props;

    const [form, setForm] = useState(initialForm);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');

    const {
        event_type,
        title,
        guest_name,
        guest_email,
        guest_phone,
        timezone,
        start_at,
        duration_minutes,
        status,
        notes,
        cancel_reason,
    } = form;

    const fieldClass =
        'input input-bordered w-full bg-base-100 text-base-content placeholder:text-base-content/60';
    const selectClass =
        'select select-bordered w-full bg-base-100 text-base-content';
    const textareaClass =
        'textarea textarea-bordered w-full bg-base-100 text-base-content placeholder:text-base-content/60';

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    useEffect(() => {
        const loadBooking = async () => {
            setIsLoading(true);
            setError('');

            try {
                const booking = await fetchBookingById(bookingId);
                if (!booking) throw new Error('Booking not found.');

                setForm({
                    event_type: booking.event_type || 'Discovery Call',
                    title: booking.title || '',
                    guest_name: booking.guest_name || '',
                    guest_email: booking.guest_email || '',
                    guest_phone: booking.guest_phone || '',
                    timezone: booking.timezone || 'Asia/Dhaka',
                    start_at: toDateTimeLocal(booking.start_at),
                    duration_minutes: booking.duration_minutes ?? 30,
                    status: booking.status || 'pending',
                    notes: booking.notes || '',
                    cancel_reason: booking.cancel_reason || '',
                });
            } catch (err) {
                setError(getApiErrorMessage(err, 'Failed to load booking.'));
            } finally {
                setIsLoading(false);
            }
        };

        loadBooking();
    }, [bookingId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setError('');

        try {
            await updateBooking(bookingId, form);
            window.location.href = '/bookings?updated=1';
        } catch (err) {
            setError(getApiErrorMessage(err, 'Failed to update booking.'));
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="mx-auto max-w-4xl space-y-6">
            <section className="rounded-2xl border border-base-300/60 bg-base-100/75 p-8 shadow-xl backdrop-blur-lg">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between gap-3">
                    <h1 className="text-3xl font-extrabold">Edit Booking</h1>
                    <Link href="/bookings" className="btn btn-sm btn-outline">
                        Back
                    </Link>
                </div>

                {/* States */}
                {isLoading && (
                    <p className="mb-4 text-sm text-base-content/70">Loading booking...</p>
                )}

                {error && (
                    <p className="mb-4 text-sm text-error">{error}</p>
                )}

                {/* Form */}
                {!isLoading && (
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {/* Event */}
                        <div>
                            <label className="label">Event Type</label>
                            <input
                                name="event_type"
                                value={event_type}
                                onChange={handleChange}
                                className={fieldClass}
                                required
                            />
                        </div>

                        <div>
                            <label className="label">Title</label>
                            <input
                                name="title"
                                value={title}
                                onChange={handleChange}
                                className={fieldClass}
                                required
                            />
                        </div>

                        {/* Guest */}
                        <div>
                            <label className="label">Guest Name</label>
                            <input
                                name="guest_name"
                                value={guest_name}
                                onChange={handleChange}
                                className={fieldClass}
                                required
                            />
                        </div>

                        <div>
                            <label className="label">Guest Email</label>
                            <input
                                type="email"
                                name="guest_email"
                                value={guest_email}
                                onChange={handleChange}
                                className={fieldClass}
                                required
                            />
                        </div>

                        <div>
                            <label className="label">Guest Phone</label>
                            <input
                                name="guest_phone"
                                value={guest_phone}
                                onChange={handleChange}
                                className={fieldClass}
                            />
                        </div>

                        <div>
                            <label className="label">Timezone</label>
                            <input
                                name="timezone"
                                value={timezone}
                                onChange={handleChange}
                                className={fieldClass}
                                required
                            />
                        </div>

                        {/* Schedule */}
                        <div>
                            <label className="label">Start Time</label>
                            <input
                                type="datetime-local"
                                name="start_at"
                                value={start_at}
                                onChange={handleChange}
                                className={fieldClass}
                                required
                            />
                        </div>

                        <div>
                            <label className="label">Duration (minutes)</label>
                            <input
                                type="number"
                                name="duration_minutes"
                                min="15"
                                max="240"
                                value={duration_minutes}
                                onChange={handleChange}
                                className={fieldClass}
                            />
                        </div>

                        {/* Status */}
                        <div>
                            <label className="label">Status</label>
                            <select
                                name="status"
                                value={status}
                                onChange={handleChange}
                                className={selectClass}
                            >
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="cancelled">Cancelled</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>

                        {/* Notes */}
                        <div className="md:col-span-2">
                            <label className="label">Notes</label>
                            <textarea
                                name="notes"
                                value={notes}
                                onChange={handleChange}
                                className={textareaClass}
                            />
                        </div>

                        {/* Cancel reason */}
                        {status === 'cancelled' && (
                            <div className="md:col-span-2">
                                <label className="label">Cancel Reason</label>
                                <textarea
                                    name="cancel_reason"
                                    value={cancel_reason}
                                    onChange={handleChange}
                                    className={textareaClass}
                                />
                            </div>
                        )}

                        {/* Submit */}
                        <div className="md:col-span-2">
                            <button
                                type="submit"
                                className="btn btn-success w-full"
                                disabled={isSaving}
                            >
                                {isSaving ? 'Saving...' : 'Update Booking'}
                            </button>
                        </div>
                    </form>
                )}
            </section>
        </div>
    );
}