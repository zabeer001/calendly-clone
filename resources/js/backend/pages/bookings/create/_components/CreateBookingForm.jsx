import React, { useMemo, useState } from 'react';
import { format, parse } from 'date-fns';
// import { createBooking, getApiErrorMessage } from '../../api/bookingApi';
import useCreateBookingStore from '../_store/useCreateBookingStore';
import CreateBookingStepOne from './CreateBookingStepOne';
import CreateBookingStepTwo from './CreateBookingStepTwo';
import { createBooking, getApiErrorMessage } from '../../api/bookingApi';

function formatSelection(value) {
    if (!value) {
        return 'Choose a date and time to continue.';
    }

    const parsed = parse(value, "yyyy-MM-dd'T'HH:mm", new Date());

    if (Number.isNaN(parsed.getTime())) {
        return 'Choose a date and time to continue.';
    }

    return format(parsed, "EEEE, MMMM d 'at' h:mm a");
}

export default function CreateBookingForm() {
    const [currentStep, setCurrentStep] = useState(1);
    const startAt = useCreateBookingStore((state) => state.form.start_at);
    const isSaving = useCreateBookingStore((state) => state.isSaving);
    const setError = useCreateBookingStore((state) => state.setError);
    const setIsSaving = useCreateBookingStore((state) => state.setIsSaving);
    const selectedSummary = useMemo(() => formatSelection(startAt), [startAt]);

    const handleSubmit = async () => {
        const { form } = useCreateBookingStore.getState();

        setIsSaving(true);
        setError('');

        try {
            await createBooking(form);
            window.location.href = '/bookings?created=1';
        } catch (err) {
            setError(getApiErrorMessage(err, 'Failed to create booking.'));
        } finally {
            setIsSaving(false);
        }
    };

    if (currentStep === 1) {
        return (
            <CreateBookingStepOne
                selectedSummary={selectedSummary}
                onContinue={() => setCurrentStep(2)}
            />
        );
    }

    return (
        <CreateBookingStepTwo
            isSaving={isSaving}
            selectedSummary={selectedSummary}
            onBack={() => setCurrentStep(1)}
            onSubmit={handleSubmit}
        />
    );
}
