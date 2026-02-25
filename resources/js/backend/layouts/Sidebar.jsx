import React from 'react';
import { Link, usePage } from '@inertiajs/react';

const menuItems = [
    { label: 'Dashboard', href: '/dashbaord' },
    { label: 'Users', href: '/users' },
    { label: 'Bookings', href: '/bookings' },
    { label: 'Reports', href: '/reports' },
    { label: 'Settings', href: '/settings' },
];

function Sidebar() {
    const { url } = usePage();

    return (
        <aside className="drawer-side z-20">
            <label htmlFor="admin-drawer" aria-label="close sidebar" className="drawer-overlay" />
            <div className="min-h-full w-72 border-r border-base-300/50 bg-base-100/90 p-4 backdrop-blur-md">
                <div className="mb-6 rounded-2xl bg-gradient-to-r from-success to-emerald-500 p-4 text-success-content shadow-lg">
                    <p className="text-xs uppercase tracking-[0.18em] opacity-90">Control Center</p>
                    <h2 className="mt-2 text-2xl font-extrabold">Dashboard</h2>
                </div>

                <ul className="menu w-full gap-2 rounded-box p-0">
                    {menuItems.map((item) => (
                        <li key={item.label} className="w-full">
                            <Link
                                href={item.href}
                                className={`w-full rounded-lg px-3 py-3 transition-colors duration-200 ${
                                    url === item.href
                                        ? 'bg-success font-semibold text-success-content'
                                        : 'text-base-content/80 hover:bg-base-200 hover:text-base-content'
                                }`}
                            >
                                {item.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </aside>
    );
}

export default Sidebar;
