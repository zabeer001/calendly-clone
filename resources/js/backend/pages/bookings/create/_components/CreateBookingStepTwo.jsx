import React from 'react';
import { ArrowLeft, ClipboardList } from 'lucide-react';
import GuestsSection from './GuestsSection';
import { fieldClass } from './formClasses';
import EventTypeField from '../../_components/form-fields/EventTypeField';
import TitleField from '../../_components/form-fields/TitleField';
import StatusField from '../../_components/form-fields/StatusField';
import NotesField from '../../_components/form-fields/NotesField';
import CancelReasonField from '../../_components/form-fields/CancelReasonField';

export default function CreateBookingStepTwo({
    cancelReason,
    eventType,
    isSaving,
    notes,
    selectedSummary,
    status,
    title,
    onBack,
    onSubmit,
    onUpdateField,
}) {
    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-base-300/60 bg-base-100 p-5 shadow-sm">
                <div>
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-base-content/60">
                        <ClipboardList size={14} />
                        Step 2
                    </div>
                    <h3 className="mt-2 text-xl font-bold">Add the booking details</h3>
                    <p className="mt-1 text-sm text-base-content/65">{selectedSummary}</p>
                </div>

                <button
                    type="button"
                    className="btn btn-sm btn-outline"
                    onClick={onBack}
                >
                    <ArrowLeft size={16} />
                    Back to schedule
                </button>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <EventTypeField
                    value={eventType}
                    onChange={(e) => onUpdateField('event_type', e.target.value)}
                />
                <TitleField value={title} onChange={(e) => onUpdateField('title', e.target.value)} />
                <GuestsSection fieldClass={fieldClass} />
                <StatusField value={status} onChange={(e) => onUpdateField('status', e.target.value)} />
                <NotesField value={notes} onChange={(e) => onUpdateField('notes', e.target.value)} />
                <CancelReasonField
                    value={cancelReason}
                    onChange={(e) => onUpdateField('cancel_reason', e.target.value)}
                    visible={status === 'cancelled'}
                />

                <div className="md:col-span-2 flex gap-3">
                    <button
                        type="button"
                        className="btn btn-outline flex-1"
                        onClick={onBack}
                    >
                        <ArrowLeft size={16} />
                        Previous
                    </button>
                    <button
                        type="button"
                        className="btn btn-success flex-1"
                        disabled={isSaving}
                        onClick={onSubmit}
                    >
                        {isSaving ? 'Saving...' : 'Create Booking'}
                    </button>
                </div>
            </div>
        </div>
    );
}
