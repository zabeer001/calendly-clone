import React from 'react';
import NoticeCard from '../NoticeCard';
import SelectionSummaryCard from '../SelectionSummaryCard';
import StartAtCalendarSection from './_compoennts/StartAtCalendarSection';
import StartAtHeader from './_compoennts/StartAtHeader';
import StartAtTimeSlotsSection from './_compoennts/StartAtTimeSlotsSection';
import useStartAtFieldState from './useStartAtFieldState';

export default function StartAtField({
    value,
    onChange,
    durationMinutes = 30,
}) {
    const {
        selectedDate,
        selectedSummary,
        selectedTime,
        slotInterval,
        timeSlots,
        visibleMonth,
        handleDateSelect,
        handleTimeSelect,
        setVisibleMonth,
    } = useStartAtFieldState({
        value,
        onChange,
        durationMinutes,
    });

    return (
        <div className="rounded-2xl border border-base-300/60 bg-base-100 p-5 shadow-sm">
            <StartAtHeader slotInterval={slotInterval} />

            <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_17rem]">
                <StartAtCalendarSection
                    selectedDate={selectedDate}
                    onDateSelect={handleDateSelect}
                    setVisibleMonth={setVisibleMonth}
                    visibleMonth={visibleMonth}
                />
                <StartAtTimeSlotsSection
                    selectedDate={selectedDate}
                    selectedTime={selectedTime}
                    timeSlots={timeSlots}
                    onTimeSelect={handleTimeSelect}
                />
            </div>

            <SelectionSummaryCard value={selectedSummary} />
            <NoticeCard title="Holiday notice">
                Sundays are marked as holidays and cannot be booked.
            </NoticeCard>
        </div>
    );
}
