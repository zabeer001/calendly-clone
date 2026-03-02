import React from 'react';
import LabeledSelect from './LabeledSelect';
import { selectClass } from '../../../backend/pages/bookings/_components/formClasses';

export default function StatusField({ value, onChange }) {
    return (
        <LabeledSelect
            label="Status"
            name="status"
            value={value}
            onChange={onChange}
            className={selectClass}
            options={[
                { value: 'pending', label: 'Pending' },
                { value: 'confirmed', label: 'Confirmed' },
                { value: 'cancelled', label: 'Cancelled' },
                { value: 'completed', label: 'Completed' },
            ]}
        />
    );
}
