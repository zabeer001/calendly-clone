import React from 'react';
import { format } from 'date-fns';
import { Clock3 } from 'lucide-react';

export default function StartAtTimeSlotsSection({
    onTimeSelect,
    selectedDate,
    selectedTime,
    timeSlots,
}) {
    return (
        <div className="rounded-2xl border border-base-300/60 bg-base-100 p-3">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
                <Clock3 size={16} />
                <span>
                    {selectedDate ? format(selectedDate, 'EEE, MMM d') : 'Choose a day'}
                </span>
            </div>

            {!selectedDate ? (
                <div className="rounded-xl border border-dashed border-base-300 px-4 py-8 text-center text-sm text-base-content/60">
                    Select a date to view available times.
                </div>
            ) : (
                <div className="grid max-h-80 grid-cols-2 gap-2 overflow-y-auto pr-1">
                    {timeSlots.map((slot) => (
                        <button
                            key={slot.value}
                            type="button"
                            className={`btn btn-sm h-auto min-h-0 px-3 py-2 ${
                                selectedTime === slot.value
                                    ? 'btn-primary'
                                    : 'btn-outline'
                            }`}
                            disabled={slot.disabled}
                            onClick={() => onTimeSelect(slot.value)}
                        >
                            {slot.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
