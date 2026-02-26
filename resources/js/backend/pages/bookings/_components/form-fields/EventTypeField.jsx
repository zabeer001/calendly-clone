import React from 'react';
import LabeledInput from './LabeledInput';
import { fieldClass } from '../formClasses';

export default function EventTypeField({ value, onChange }) {
    return (
        <LabeledInput
            label="Event Type"
            name="event_type"
            value={value}
            onChange={onChange}
            className={fieldClass}
            required
        />
    );
}
