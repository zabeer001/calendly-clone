import React from 'react';
import GuestsSection from './GuestsSection';
import { fieldClass } from './formClasses';
import EventTypeField from '../../../../../common/booking/form-fields/EventTypeField';
import TitleField from '../../../../../common/booking/form-fields/TitleField';
import TimezoneField from '../../../../../common/booking/form-fields/TimezoneField';
import StartAtField from '../../../../../common/booking/form-fields/startAtField/StartAtField';
import DurationField from '../../../../../common/booking/form-fields/DurationField';
import StatusField from '../../../../../common/booking/form-fields/StatusField';
import NotesField from '../../../../../common/booking/form-fields/NotesField';
import CancelReasonField from '../../../../../common/booking/form-fields/CancelReasonField';
import useEditBookingStore from '../_store/useEditBookingStore';

export default function EditBookingFields({
    isSaving,
    onSubmit,
}) {
    const eventType = useEditBookingStore((state) => state.form.event_type);
    const title = useEditBookingStore((state) => state.form.title);
    const timezone = useEditBookingStore((state) => state.form.timezone);
    const startAt = useEditBookingStore((state) => state.form.start_at);
    const durationMinutes = useEditBookingStore((state) => state.form.duration_minutes);
    const status = useEditBookingStore((state) => state.form.status);
    const notes = useEditBookingStore((state) => state.form.notes);
    const cancelReason = useEditBookingStore((state) => state.form.cancel_reason);
    const updateField = useEditBookingStore((state) => state.updateField);

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
            <div className="md:col-span-2">
                <StartAtField
                    value={startAt}
                    durationMinutes={durationMinutes}
                    onChange={(e) => updateField('start_at', e.target.value)}
                />
            </div>
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
                    onClick={onSubmit}
                >
                    {isSaving ? 'Saving...' : 'Update Booking'}
                </button>
            </div>
        </div>
    );
}
