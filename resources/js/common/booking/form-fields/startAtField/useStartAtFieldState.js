import { useEffect, useMemo, useState } from 'react';
import { isBefore, isSameDay, set, startOfToday } from 'date-fns';
import {
    buildStartAtValue,
    buildTimeSlots,
    formatSelectedSummary,
    getSlotInterval,
    parseDateTimeValue,
    toSyntheticChange,
} from './utils';

export default function useStartAtFieldState({
    value,
    onChange,
    durationMinutes,
}) {
    const [selectedDate, setSelectedDate] = useState(() => parseDateTimeValue(value).date);
    const [selectedTime, setSelectedTime] = useState(() => parseDateTimeValue(value).time);
    const [visibleMonth, setVisibleMonth] = useState(
        () => parseDateTimeValue(value).date || startOfToday(),
    );

    useEffect(() => {
        const nextValue = parseDateTimeValue(value);
        setSelectedDate(nextValue.date);
        setSelectedTime(nextValue.time);

        if (nextValue.date) {
            setVisibleMonth(nextValue.date);
        }
    }, [value]);

    const slotInterval = useMemo(
        () => getSlotInterval(durationMinutes),
        [durationMinutes],
    );

    const timeSlots = useMemo(
        () => buildTimeSlots(selectedDate, slotInterval),
        [selectedDate, slotInterval],
    );

    const selectedSummary = useMemo(
        () => formatSelectedSummary(value),
        [value],
    );

    const emitStartAt = (date, time) => {
        if (!date || !time) {
            onChange(toSyntheticChange(''));
            return;
        }

        onChange(toSyntheticChange(buildStartAtValue(date, time)));
    };

    const handleDateSelect = (date) => {
        if (!date) {
            setSelectedDate(undefined);
            setSelectedTime('');
            emitStartAt(undefined, '');
            return;
        }

        setSelectedDate(date);
        setVisibleMonth(date);

        if (!selectedTime) {
            emitStartAt(undefined, '');
            return;
        }

        const [hours, minutes] = selectedTime.split(':').map(Number);
        const candidateDate = set(date, {
            hours,
            minutes,
            seconds: 0,
            milliseconds: 0,
        });
        const now = new Date();

        if (isSameDay(date, now) && isBefore(candidateDate, now)) {
            setSelectedTime('');
            emitStartAt(undefined, '');
            return;
        }

        emitStartAt(date, selectedTime);
    };

    const handleTimeSelect = (time) => {
        setSelectedTime(time);
        emitStartAt(selectedDate, time);
    };

    return {
        selectedDate,
        selectedSummary,
        selectedTime,
        slotInterval,
        timeSlots,
        visibleMonth,
        handleDateSelect,
        handleTimeSelect,
        setVisibleMonth,
    };
}
