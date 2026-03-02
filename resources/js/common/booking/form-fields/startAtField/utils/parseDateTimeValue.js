import { format, parse } from 'date-fns';

export default function parseDateTimeValue(value) {
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
