import React from 'react';
import LabeledTextarea from './LabeledTextarea';
import { textareaClass } from '../formClasses';

export default function NotesField({ value, onChange }) {
    return (
        <LabeledTextarea
            label="Notes"
            name="notes"
            value={value}
            onChange={onChange}
            className={textareaClass}
            wrapperClassName="md:col-span-2"
        />
    );
}
