import { create } from 'zustand';

export const initialCreateBookingForm = {
    event_type: 'Discovery Call',
    title: '',
    guests: [
        {
            name: '',
            email: '',
            phone: '',
        },
    ],
    timezone: 'Asia/Dhaka',
    start_at: '',
    duration_minutes: 30,
    status: 'pending',
    notes: '',
    cancel_reason: '',
};

const useCreateBookingStore = create((set) => ({
    form: initialCreateBookingForm,
    isSaving: false,
    error: '',

    setError: (error) => set({ error }),
    setIsSaving: (isSaving) => set({ isSaving }),
    reset: () =>
        set({
            form: initialCreateBookingForm,
            isSaving: false,
            error: '',
        }),

    updateField: (name, value) =>
        set((state) => ({
            form: {
                ...state.form,
                [name]: value,
            },
        })),

    updateGuestField: (index, field, value) =>
        set((state) => ({
            form: {
                ...state.form,
                guests: state.form.guests.map((guest, guestIndex) => {
                    if (guestIndex !== index) {
                        return guest;
                    }

                    return {
                        ...guest,
                        [field]: value,
                    };
                }),
            },
        })),

    addGuest: () =>
        set((state) => ({
            form: {
                ...state.form,
                guests: [
                    ...state.form.guests,
                    {
                        name: '',
                        email: '',
                        phone: '',
                    },
                ],
            },
        })),

    removeGuest: (index) =>
        set((state) => ({
            form: {
                ...state.form,
                guests: state.form.guests.filter((_, guestIndex) => guestIndex !== index),
            },
        })),
}));

export default useCreateBookingStore;
