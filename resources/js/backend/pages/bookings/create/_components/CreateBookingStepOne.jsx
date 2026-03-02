import React from 'react';
import { ArrowRight, CalendarDays } from 'lucide-react';
import TimezoneField from '../../_components/form-fields/TimezoneField';
import StartAtField from '../../_components/form-fields/StartAtField';
import DurationField from '../../_components/form-fields/DurationField';

export default function CreateBookingStepOne({
    durationMinutes,
    selectedSummary,
    startAt,
    timezone,
    onContinue,
    onUpdateField,
}) {
    return (
        <div className="space-y-6">
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
                <StartAtField
                    value={startAt}
                    durationMinutes={durationMinutes}
                    onChange={(e) => onUpdateField('start_at', e.target.value)}
                />

                <div className="space-y-4">
                    <div className="rounded-2xl border border-base-300/60 bg-base-100 p-5 shadow-sm">
                        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-base-content/60">
                            <CalendarDays size={14} />
                            Scheduling details
                        </div>

                        <div className="mt-4 space-y-4">
                            <TimezoneField
                                value={timezone}
                                onChange={(e) => onUpdateField('timezone', e.target.value)}
                            />
                            <DurationField
                                value={durationMinutes}
                                onChange={(e) => onUpdateField('duration_minutes', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="rounded-2xl border border-base-300/60 bg-base-100 p-5 shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-base-content/60">
                            Booking preview
                        </p>
                        <p className="mt-2 text-base font-semibold">{selectedSummary}</p>
                        <p className="mt-2 text-sm text-base-content/65">
                            The rest of the booking details come in the next step.
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    type="button"
                    className="btn btn-primary"
                    disabled={!startAt}
                    onClick={onContinue}
                >
                    Continue
                    <ArrowRight size={16} />
                </button>
            </div>
        </div>
    );
}
