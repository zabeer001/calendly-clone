import { format } from 'date-fns';
import parseDateTimeValue from './parseDateTimeValue';

export default function formatSelectedSummary(value) {
    const parsedValue = parseDateTimeValue(value);

    if (!parsedValue.date || !parsedValue.time) {
        return 'No date and time selected yet.';
    }

    return format(parsedValue.date, "EEEE, MMMM d 'at' h:mm a");
}
