export default function toSyntheticChange(value) {
    return {
        target: {
            name: 'start_at',
            value,
        },
    };
}
