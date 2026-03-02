import { format, set } from 'date-fns';

export default function buildStartAtValue(date, time) {
    const [hours, minutes] = time.split(':').map(Number);

    return format(
        set(date, {
            hours,
            minutes,
            seconds: 0,
            milliseconds: 0,
        }),
        "yyyy-MM-dd'T'HH:mm",
    );
}
