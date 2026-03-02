import React from 'react';
import { DayPicker } from 'react-day-picker';
import { isSunday, startOfDay } from 'date-fns';
import { SUNDAY_MATCHER } from '../startAtField.constants';
import 'react-day-picker/style.css';

export default function StartAtCalendarSection({
    onDateSelect,
    selectedDate,
    setVisibleMonth,
    visibleMonth,
}) {
    return (
        <div className="rounded-2xl border border-base-300/60 bg-base-100 p-3">
            <DayPicker
                mode="single"
                selected={selectedDate}
                onSelect={onDateSelect}
                onMonthChange={setVisibleMonth}
                showOutsideDays
                fixedWeeks
                disabled={[{ before: startOfDay(new Date()) }, SUNDAY_MATCHER]}
                modifiers={{
                    holiday: (date) => isSunday(date),
                }}
                modifiersStyles={{
                    holiday: {
                        color: 'rgb(239, 68, 68)',
                        fontWeight: 700,
                    },
                }}
                month={visibleMonth}
                className="mx-auto"
            />
        </div>
    );
}
