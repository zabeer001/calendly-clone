import React from 'react';

export default function LabeledInput({
    label,
    name,
    value,
    onChange,
    className,
    type = 'text',
    required = false,
    min,
    max,
}) {
    return (
        <div>
            <label className="label">{label}</label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                className={className}
                required={required}
                min={min}
                max={max}
            />
        </div>
    );
}
