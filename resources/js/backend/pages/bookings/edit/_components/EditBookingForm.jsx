import React, { useEffect } from 'react';
import { fetchBookingById, getApiErrorMessage, updateBooking } from '../../api/bookingApi';
import useEditBookingStore from '../_store/useEditBookingStore';
import GuestsSection from './GuestsSection';
import { fieldClass } from './formClasses';
import EventTypeField from '../../_components/form-fields/EventTypeField';
import TitleField from '../../_components/form-fields/TitleField';
import TimezoneField from '../../_components/form-fields/TimezoneField';
import StartAtField from '../../_components/form-fields/StartAtField';
import DurationField from '../../_components/form-fields/DurationField';
import StatusField from '../../_components/form-fields/StatusField';
import NotesField from '../../_components/form-fields/NotesField';
import CancelReasonField from '../../_components/form-fields/CancelReasonField';

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
    const eventType = useEditBookingStore((state) => state.form.event_type);
    const title = useEditBookingStore((state) => state.form.title);
    const timezone = useEditBookingStore((state) => state.form.timezone);
    const startAt = useEditBookingStore((state) => state.form.start_at);
    const durationMinutes = useEditBookingStore((state) => state.form.duration_minutes);
    const status = useEditBookingStore((state) => state.form.status);
    const notes = useEditBookingStore((state) => state.form.notes);
    const cancelReason = useEditBookingStore((state) => state.form.cancel_reason);
    const isLoading = useEditBookingStore((state) => state.isLoading);
    const isSaving = useEditBookingStore((state) => state.isSaving);
    const updateField = useEditBookingStore((state) => state.updateField);
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

    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <EventTypeField
                value={eventType}
                onChange={(e) => updateField('event_type', e.target.value)}
            />
            <TitleField value={title} onChange={(e) => updateField('title', e.target.value)} />
            <GuestsSection fieldClass={fieldClass} />
            <TimezoneField
                value={timezone}
                onChange={(e) => updateField('timezone', e.target.value)}
            />
            <StartAtField value={startAt} onChange={(e) => updateField('start_at', e.target.value)} />
            <DurationField
                value={durationMinutes}
                onChange={(e) => updateField('duration_minutes', e.target.value)}
            />
            <StatusField value={status} onChange={(e) => updateField('status', e.target.value)} />
            <NotesField value={notes} onChange={(e) => updateField('notes', e.target.value)} />
            <CancelReasonField
                value={cancelReason}
                onChange={(e) => updateField('cancel_reason', e.target.value)}
                visible={status === 'cancelled'}
            />

            <div className="md:col-span-2">
                <button
                    type="button"
                    className="btn btn-success w-full"
                    disabled={isSaving}
                    onClick={handleSubmit}
                >
                    {isSaving ? 'Saving...' : 'Update Booking'}
                </button>
            </div>
        </div>
    );
}
