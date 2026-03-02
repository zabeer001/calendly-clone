import React from 'react';

export default function LabeledSelect({
    label,
    name,
    value,
    onChange,
    className,
    options = [],
    visible = true,
}) {
    if (!visible) {
        return null;
    }

    return (
        <div>
            <label className="label">{label}</label>
            <select
                name={name}
                value={value}
                onChange={onChange}
                className={className}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
}
