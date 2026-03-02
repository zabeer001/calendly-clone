import React from 'react';
import LabeledTextarea from './LabeledTextarea';
import { textareaClass } from '../../../backend/pages/bookings/_components/formClasses';

export default function CancelReasonField({ value, onChange, visible }) {
    return (
        <LabeledTextarea
            label="Cancel Reason"
            name="cancel_reason"
            value={value}
            onChange={onChange}
            className={textareaClass}
            wrapperClassName="md:col-span-2"
            visible={visible}
        />
    );
}
