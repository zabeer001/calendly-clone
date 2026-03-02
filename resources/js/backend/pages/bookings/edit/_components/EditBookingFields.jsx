import React from 'react';
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

export default function EditBookingFields({
    cancelReason,
    durationMinutes,
    eventType,
    isSaving,
    notes,
    startAt,
    status,
    timezone,
    title,
    onSubmit,
    onUpdateField,
}) {
    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <EventTypeField
                value={eventType}
                onChange={(e) => onUpdateField('event_type', e.target.value)}
            />
            <TitleField value={title} onChange={(e) => onUpdateField('title', e.target.value)} />
            <GuestsSection fieldClass={fieldClass} />
            <TimezoneField
                value={timezone}
                onChange={(e) => onUpdateField('timezone', e.target.value)}
            />
            <div className="md:col-span-2">
                <StartAtField
                    value={startAt}
                    durationMinutes={durationMinutes}
                    onChange={(e) => onUpdateField('start_at', e.target.value)}
                />
            </div>
            <DurationField
                value={durationMinutes}
                onChange={(e) => onUpdateField('duration_minutes', e.target.value)}
            />
            <StatusField value={status} onChange={(e) => onUpdateField('status', e.target.value)} />
            <NotesField value={notes} onChange={(e) => onUpdateField('notes', e.target.value)} />
            <CancelReasonField
                value={cancelReason}
                onChange={(e) => onUpdateField('cancel_reason', e.target.value)}
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
