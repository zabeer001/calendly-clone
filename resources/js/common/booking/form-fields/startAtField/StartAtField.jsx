import React, { useEffect, useMemo, useState } from 'react';
import { DayPicker } from 'react-day-picker';
import { CalendarDays, Clock3 } from 'lucide-react';
import NoticeCard from '../NoticeCard';
import SelectionSummaryCard from '../SelectionSummaryCard';
import {
    format,
    isBefore,
    isSameDay,
    isSunday,
    parse,
    set,
    startOfDay,
    startOfToday,
} from 'date-fns';
import 'react-day-picker/style.css';

const DISPLAY_START_HOUR = 9;
const DISPLAY_END_HOUR = 18;
const SUNDAY_MATCHER = { dayOfWeek: [0] };

function parseDateTimeValue(value) {
    if (!value) {
        return {
            date: undefined,
            time: '',
        };
    }

    const parsed = parse(value, "yyyy-MM-dd'T'HH:mm", new Date());

    if (Number.isNaN(parsed.getTime())) {
        return {
            date: undefined,
            time: '',
        };
    }

    return {
        date: parsed,
        time: format(parsed, 'HH:mm'),
    };
}

function toSyntheticChange(value) {
    return {
        target: {
            name: 'start_at',
            value,
        },
    };
}

export default function StartAtField({
    value,
    onChange,
    durationMinutes = 30,
}) {
    const [selectedDate, setSelectedDate] = useState(() => parseDateTimeValue(value).date);
    const [selectedTime, setSelectedTime] = useState(() => parseDateTimeValue(value).time);
    const [visibleMonth, setVisibleMonth] = useState(() => parseDateTimeValue(value).date || startOfToday());

    useEffect(() => {
        const nextValue = parseDateTimeValue(value);
        setSelectedDate(nextValue.date);
        setSelectedTime(nextValue.time);

        if (nextValue.date) {
            setVisibleMonth(nextValue.date);
        }
    }, [value]);

    const slotInterval = useMemo(() => {
        const normalizedValue = Number(durationMinutes);

        if (Number.isNaN(normalizedValue)) {
            return 30;
        }

        return Math.min(Math.max(normalizedValue, 15), 60);
    }, [durationMinutes]);

    const timeSlots = useMemo(() => {
        if (!selectedDate) {
            return [];
        }

        const slots = [];
        const now = new Date();

        for (
            let minutes = DISPLAY_START_HOUR * 60;
            minutes < DISPLAY_END_HOUR * 60;
            minutes += slotInterval
        ) {
            const hours = Math.floor(minutes / 60);
            const mins = minutes % 60;
            const slotDate = set(selectedDate, {
                hours,
                minutes: mins,
                seconds: 0,
                milliseconds: 0,
            });

            slots.push({
                label: format(slotDate, 'h:mm a'),
                value: format(slotDate, 'HH:mm'),
                disabled: isSameDay(selectedDate, now) && isBefore(slotDate, now),
            });
        }

        return slots;
    }, [selectedDate, slotInterval]);

    const selectedSummary = useMemo(() => {
        const parsedValue = parseDateTimeValue(value);

        if (!parsedValue.date || !parsedValue.time) {
            return 'No date and time selected yet.';
        }

        return format(parsedValue.date, "EEEE, MMMM d 'at' h:mm a");
    }, [value]);

    const emitStartAt = (date, time) => {
        if (!date || !time) {
            onChange(toSyntheticChange(''));
            return;
        }

        const [hours, minutes] = time.split(':').map(Number);
        const nextValue = format(
            set(date, {
                hours,
                minutes,
                seconds: 0,
                milliseconds: 0,
            }),
            "yyyy-MM-dd'T'HH:mm",
        );

        onChange(toSyntheticChange(nextValue));
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

        if (selectedTime) {
            const [hours, minutes] = selectedTime.split(':').map(Number);
            const candidateDate = set(date, {
                hours,
                minutes,
                seconds: 0,
                milliseconds: 0,
            });

            if (isSameDay(date, new Date()) && isBefore(candidateDate, new Date())) {
                setSelectedTime('');
                emitStartAt(undefined, '');
                return;
            }

            emitStartAt(date, selectedTime);
            return;
        }

        emitStartAt(undefined, '');
    };

    const handleTimeSelect = (time) => {
        setSelectedTime(time);
        emitStartAt(selectedDate, time);
    };

    return (
        <div className="rounded-2xl border border-base-300/60 bg-base-100 p-5 shadow-sm">
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
                    <p className="text-xs uppercase tracking-[0.16em] text-base-content/55">Slot interval</p>
                    <p className="mt-1 text-sm font-semibold">{slotInterval} minutes</p>
                </div>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_17rem]">
                <div className="rounded-2xl border border-base-300/60 bg-base-100 p-3">
                    <DayPicker
                        mode="single"
                        selected={selectedDate}
                        onSelect={handleDateSelect}
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
                    <NoticeCard title="Holiday notice">
                        Sundays are marked as holidays and cannot be booked.
                    </NoticeCard>
                </div>

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
                                    onClick={() => handleTimeSelect(slot.value)}
                                >
                                    {slot.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <SelectionSummaryCard value={selectedSummary} />
        </div>
    );
}
