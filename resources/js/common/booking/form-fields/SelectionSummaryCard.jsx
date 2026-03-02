import React from 'react';

export default function SelectionSummaryCard({ title = 'Selected', value }) {
    return (
        <div className="mt-5 rounded-2xl border border-success/20 bg-success/5 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.16em] text-success/70">{title}</p>
            <p className="mt-1 text-sm font-medium text-success">{value}</p>
        </div>
    );
}
