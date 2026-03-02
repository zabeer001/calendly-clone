import React, { useMemo, useState } from 'react';
import { format, parse } from 'date-fns';
import { createBooking, getApiErrorMessage } from '../../api/bookingApi';
import useCreateBookingStore from '../_store/useCreateBookingStore';
import CreateBookingStepOne from './CreateBookingStepOne';
import CreateBookingStepTwo from './CreateBookingStepTwo';

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
    const eventType = useCreateBookingStore((state) => state.form.event_type);
    const title = useCreateBookingStore((state) => state.form.title);
    const timezone = useCreateBookingStore((state) => state.form.timezone);
    const startAt = useCreateBookingStore((state) => state.form.start_at);
    const durationMinutes = useCreateBookingStore((state) => state.form.duration_minutes);
    const status = useCreateBookingStore((state) => state.form.status);
    const notes = useCreateBookingStore((state) => state.form.notes);
    const cancelReason = useCreateBookingStore((state) => state.form.cancel_reason);
    const isSaving = useCreateBookingStore((state) => state.isSaving);
    const updateField = useCreateBookingStore((state) => state.updateField);
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
                durationMinutes={durationMinutes}
                selectedSummary={selectedSummary}
                startAt={startAt}
                timezone={timezone}
                onContinue={() => setCurrentStep(2)}
                onUpdateField={updateField}
            />
        );
    }

    return (
        <CreateBookingStepTwo
            cancelReason={cancelReason}
            eventType={eventType}
            isSaving={isSaving}
            notes={notes}
            selectedSummary={selectedSummary}
            status={status}
            title={title}
            onBack={() => setCurrentStep(1)}
            onSubmit={handleSubmit}
            onUpdateField={updateField}
        />
    );
}
