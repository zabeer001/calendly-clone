import React from 'react';
import { CalendarDays } from 'lucide-react';

export default function StartAtHeader({ slotInterval }) {
    return (
        <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-base-content/60">
                    <CalendarDays size={14} />
                    Step 1
                </div>
                <h3 className="mt-2 text-xl font-bold">Pick a date and time</h3>
                <p className="mt-1 text-sm text-base-content/65">
                    Choose an available day first, then select a start time.
                </p>
            </div>

            <div className="rounded-xl border border-base-300/60 bg-base-200/60 px-3 py-2 text-right">
                <p className="text-xs uppercase tracking-[0.16em] text-base-content/55">
                    Slot interval
                </p>
                <p className="mt-1 text-sm font-semibold">{slotInterval} minutes</p>
            </div>
        </div>
    );
}
