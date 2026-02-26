import React from 'react';
import { createBooking, getApiErrorMessage } from '../../api/bookingApi';
import useCreateBookingStore from '../_store/useCreateBookingStore';
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

export default function CreateBookingForm() {
    const eventType = useCreateBookingStore((state) => state.form.event_type);
    const title = useCreateBookingStore((state) => state.form.title);
    const timezone = useCreateBookingStore((state) => state.form.timezone);
    const startAt = useCreateBookingStore((state) => state.form.start_at);
    const durationMinutes = useCreateBookingStore((state) => state.form.duration_minutes);
    const status = useCreateBookingStore((state) => state.form.status);
    const notes = useCreateBookingStore((state) => state.form.notes);
    const cancelReason = useCreateBookingStore((state) => state.form.cancel_reason);
    const isSaving = useCreateBookingStore((state) => state.isSaving);
    const updateField = useCreateBookingStore((state) => state.updateField);
    const setError = useCreateBookingStore((state) => state.setError);
    const setIsSaving = useCreateBookingStore((state) => state.setIsSaving);

    const handleSubmit = async () => {
        const { form } = useCreateBookingStore.getState();

        setIsSaving(true);
        setError('');

        try {
            await createBooking(form);
            window.location.href = '/bookings?created=1';
        } catch (err) {
            setError(getApiErrorMessage(err, 'Failed to create booking.'));
        } finally {
            setIsSaving(false);
        }
    };

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
                    {isSaving ? 'Saving...' : 'Create Booking'}
                </button>
            </div>
        </div>
    );
}
