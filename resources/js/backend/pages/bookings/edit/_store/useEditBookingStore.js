import { create } from 'zustand';

const emptyGuest = {
    name: '',
    email: '',
    phone: '',
};

export const initialEditBookingForm = {
    event_type: 'Discovery Call',
    title: '',
    guests: [{ ...emptyGuest }],
    timezone: 'Asia/Dhaka',
    start_at: '',
    duration_minutes: 30,
    status: 'pending',
    notes: '',
    cancel_reason: '',
};

const useEditBookingStore = create((set) => ({
    form: initialEditBookingForm,
    isLoading: true,
    isSaving: false,
    error: '',

    setForm: (form) => set({ form }),
    setError: (error) => set({ error }),
    setIsLoading: (isLoading) => set({ isLoading }),
    setIsSaving: (isSaving) => set({ isSaving }),

    reset: () =>
        set({
            form: initialEditBookingForm,
            isLoading: true,
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
                guests: [...state.form.guests, { ...emptyGuest }],
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

export default useEditBookingStore;
