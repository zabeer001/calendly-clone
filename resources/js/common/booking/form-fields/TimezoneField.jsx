import React from 'react';
import LabeledInput from './LabeledInput';
import { fieldClass } from '../../../backend/pages/bookings/_components/formClasses';

export default function TimezoneField({ value, onChange }) {
    return (
        <LabeledInput
            label="Timezone"
            name="timezone"
            value={value}
            onChange={onChange}
            className={fieldClass}
            required
        />
    );
}
