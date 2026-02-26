import React from 'react';

export default function LabeledTextarea({
    label,
    name,
    value,
    onChange,
    className,
    wrapperClassName,
    visible = true,
}) {
    if (!visible) {
        return null;
    }

    return (
        <div className={wrapperClassName}>
            <label className="label">{label}</label>
            <textarea
                name={name}
                value={value}
                onChange={onChange}
                className={className}
            />
        </div>
    );
}
