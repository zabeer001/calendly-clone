import React from 'react';
import { ArrowLeft, ClipboardList } from 'lucide-react';
import GuestsSection from './GuestsSection';
import { fieldClass } from './formClasses';
import EventTypeField from '../../form-fields/EventTypeField';
import TitleField from '../../form-fields/TitleField';
import StatusField from '../../form-fields/StatusField';
import NotesField from '../../form-fields/NotesField';
import CancelReasonField from '../../form-fields/CancelReasonField';
import useCreateBookingStore from '../_store/useCreateBookingStore';

export default function CreateBookingStepTwo({
    isSaving,
    selectedSummary,
    onBack,
    onSubmit,
}) {
    const eventType = useCreateBookingStore((state) => state.form.event_type);
    const title = useCreateBookingStore((state) => state.form.title);
    const status = useCreateBookingStore((state) => state.form.status);
    const notes = useCreateBookingStore((state) => state.form.notes);
    const cancelReason = useCreateBookingStore((state) => state.form.cancel_reason);
    const updateField = useCreateBookingStore((state) => state.updateField);

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
                    onChange={(e) => updateField('event_type', e.target.value)}
                />
                <TitleField value={title} onChange={(e) => updateField('title', e.target.value)} />
                <GuestsSection fieldClass={fieldClass} />
                <StatusField value={status} onChange={(e) => updateField('status', e.target.value)} />
                <NotesField value={notes} onChange={(e) => updateField('notes', e.target.value)} />
                <CancelReasonField
                    value={cancelReason}
                    onChange={(e) => updateField('cancel_reason', e.target.value)}
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
