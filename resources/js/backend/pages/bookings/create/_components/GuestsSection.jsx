import React from 'react';
import useCreateBookingStore from '../_store/useCreateBookingStore';

export default function GuestsSection({ fieldClass }) {
    const guests = useCreateBookingStore((state) => state.form.guests);
    const updateGuestField = useCreateBookingStore((state) => state.updateGuestField);
    const addGuest = useCreateBookingStore((state) => state.addGuest);
    const removeGuest = useCreateBookingStore((state) => state.removeGuest);

    return (
        <div className="md:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
                <label className="label">Guests</label>
                <button type="button" className="btn btn-sm btn-outline" onClick={addGuest}>
                    Add Guest
                </button>
            </div>

            {guests.map((guest, index) => (
                <div key={index} className="grid grid-cols-1 gap-3 rounded-xl border border-base-300/60 p-4 md:grid-cols-3">
                   

                    <div>
                        <label className="label">Guest Email</label>
                        <input
                            type="email"
                            value={guest.email}
                            onChange={(e) => updateGuestField(index, 'email', e.target.value)}
                            className={fieldClass}
                            required
                        />
                    </div>

                     <div>
                        <label className="label">Guest Name</label>
                        <input
                            value={guest.name}
                            onChange={(e) => updateGuestField(index, 'name', e.target.value)}
                            className={fieldClass}
                            required
                        />
                    </div>

                    <div>
                        <label className="label">Guest Phone</label>
                        <input
                            value={guest.phone}
                            onChange={(e) => updateGuestField(index, 'phone', e.target.value)}
                            className={fieldClass}
                        />
                    </div>

                    {guests.length > 1 ? (
                        <div className="md:col-span-3">
                            <button
                                type="button"
                                className="btn btn-xs btn-error btn-outline"
                                onClick={() => removeGuest(index)}
                            >
                                Remove Guest
                            </button>
                        </div>
                    ) : null}
                </div>
            ))}
        </div>
    );
}
