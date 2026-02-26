import React from 'react';
import useEditBookingStore from '../_store/useEditBookingStore';

export default function EditBookingError() {
    const error = useEditBookingStore((state) => state.error);

    if (!error) {
        return null;
    }

    return <p className="mb-4 text-sm text-error">{error}</p>;
}
