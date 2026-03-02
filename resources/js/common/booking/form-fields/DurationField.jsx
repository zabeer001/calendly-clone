import React from 'react';
import LabeledInput from './LabeledInput';
import { fieldClass } from '../../../backend/pages/bookings/_components/formClasses';

export default function DurationField({ value, onChange }) {
    return (
        <LabeledInput
            label="Duration (minutes)"
            type="number"
            name="duration_minutes"
            value={value}
            onChange={onChange}
            className={fieldClass}
            min="15"
            max="240"
        />
    );
}
