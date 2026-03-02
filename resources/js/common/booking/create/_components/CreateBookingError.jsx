import React from 'react';
import useCreateBookingStore from '../_store/useCreateBookingStore';

export default function CreateBookingError() {
    const error = useCreateBookingStore((state) => state.error);

    if (!error) {
        return null;
    }

    return <p className="mb-4 text-sm text-error">{error}</p>;
}
