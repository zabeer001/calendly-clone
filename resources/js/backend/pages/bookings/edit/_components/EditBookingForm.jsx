import React, { useEffect } from 'react';
import { fetchBookingById, getApiErrorMessage, updateBooking } from '../../api/bookingApi';
import useEditBookingStore from '../_store/useEditBookingStore';
import EditBookingFields from './EditBookingFields';

function toDateTimeLocal(value) {
    if (!value) {
        return '';
    }

    const date = new Date(value);
    const pad = (n) => String(n).padStart(2, '0');

    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function toGuests(guests) {
    if (!Array.isArray(guests) || guests.length === 0) {
        return [
            {
                name: '',
                email: '',
                phone: '',
            },
        ];
    }

    return guests.map((guest) => ({
        name: guest?.name || '',
        email: guest?.email || '',
        phone: guest?.phone || '',
    }));
}

export default function EditBookingForm({ bookingId }) {
    const isLoading = useEditBookingStore((state) => state.isLoading);
    const isSaving = useEditBookingStore((state) => state.isSaving);
    const setForm = useEditBookingStore((state) => state.setForm);
    const setError = useEditBookingStore((state) => state.setError);
    const setIsLoading = useEditBookingStore((state) => state.setIsLoading);
    const setIsSaving = useEditBookingStore((state) => state.setIsSaving);

    useEffect(() => {
        let isMounted = true;

        const loadBooking = async () => {
            setIsLoading(true);
            setError('');

            try {
                const booking = await fetchBookingById(bookingId);

                if (!isMounted) {
                    return;
                }

                if (!booking) {
                    throw new Error('Booking not found.');
                }

                setForm({
                    event_type: booking.event_type || 'Discovery Call',
                    title: booking.title || '',
                    guests: toGuests(booking.guests),
                    timezone: booking.timezone || 'Asia/Dhaka',
                    start_at: toDateTimeLocal(booking.start_at),
                    duration_minutes: booking.duration_minutes ?? 30,
                    status: booking.status || 'pending',
                    notes: booking.notes || '',
                    cancel_reason: booking.cancel_reason || '',
                });
            } catch (err) {
                if (isMounted) {
                    setError(getApiErrorMessage(err, 'Failed to load booking.'));
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        loadBooking();

        return () => {
            isMounted = false;
        };
    }, [bookingId, setError, setForm, setIsLoading]);

    const handleSubmit = async () => {
        const { form } = useEditBookingStore.getState();

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

    if (isLoading) {
        return <p className="text-sm text-base-content/70">Loading booking...</p>;
    }

    return <EditBookingFields isSaving={isSaving} onSubmit={handleSubmit} />;
}
