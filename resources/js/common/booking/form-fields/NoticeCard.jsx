import React from 'react';

export default function NoticeCard({ children, title = 'Notice', className = '' }) {
    const classes = [
        'mt-3 rounded-2xl border border-error/20 bg-error/5 px-4 py-3',
        className,
    ].filter(Boolean).join(' ');

    return (
        <div className={classes}>
            <p className="text-xs uppercase tracking-[0.16em] text-error/70">{title}</p>
            <p className="mt-1 text-sm font-medium text-error">{children}</p>
        </div>
    );
}
