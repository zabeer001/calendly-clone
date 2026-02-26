import React from 'react';
import LabeledInput from './LabeledInput';
import { fieldClass } from '../formClasses';

export default function StartAtField({ value, onChange }) {
    return (
        <LabeledInput
            label="Start Time"
            type="datetime-local"
            name="start_at"
            value={value}
            onChange={onChange}
            className={fieldClass}
            required
        />
    );
}
