export default function getSlotInterval(durationMinutes) {
    const normalizedValue = Number(durationMinutes);

    if (Number.isNaN(normalizedValue)) {
        return 30;
    }

    return Math.min(Math.max(normalizedValue, 15), 60);
}
