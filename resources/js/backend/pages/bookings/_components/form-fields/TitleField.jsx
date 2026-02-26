import React from 'react';
import LabeledInput from './LabeledInput';
import { fieldClass } from '../formClasses';

export default function TitleField({ value, onChange }) {
    return (
        <LabeledInput
            label="Title"
            name="title"
            value={value}
            onChange={onChange}
            className={fieldClass}
            required
        />
    );
}
