import { format, isBefore, isSameDay, set } from 'date-fns';
import {
    DISPLAY_END_HOUR,
    DISPLAY_START_HOUR,
} from '../startAtField.constants';

export default function buildTimeSlots(selectedDate, slotInterval) {
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
}
