import React from 'react';
import FieldShell from './FieldShell';
import { fieldClass } from '../../../backend/pages/bookings/_components/formClasses';

export default function DurationField({ value, onChange }) {
    return (
        <FieldShell label="Duration (minutes)" htmlFor="duration_minutes">
            <input
                id="duration_minutes"
                type="number"
                name="duration_minutes"
                value={value}
                onChange={onChange}
                className={fieldClass}
                min="15"
                max="240"
            />
        </FieldShell>
    );
}
