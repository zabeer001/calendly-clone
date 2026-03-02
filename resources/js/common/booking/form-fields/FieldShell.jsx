import React from 'react';

export default function FieldShell({
    label,
    htmlFor,
    children,
}) {
    return (
        <div className="space-y-2">
            <label className="label py-0" htmlFor={htmlFor}>
                {label}
            </label>
            {children}
        </div>
    );
}
