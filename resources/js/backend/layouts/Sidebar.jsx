import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    BarChart3,
    CalendarDays,
    LayoutDashboard,
    Settings,
    Users,
} from 'lucide-react';

const menuItems = [
    { label: 'Dashboard', href: '/dashbaord', icon: LayoutDashboard },
    { label: 'Users', href: '/users', icon: Users },
    { label: 'Bookings', href: '/bookings', icon: CalendarDays },
    { label: 'Reports', href: '/reports', icon: BarChart3 },
    { label: 'Settings', href: '/settings', icon: Settings },
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
                    {menuItems.map((item) => {
                        const Icon = item.icon;

                        return (
                            <li key={item.label} className="w-full">
                                <Link
                                    href={item.href}
                                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 transition-all duration-200 ${
                                        url === item.href
                                            ? 'bg-success font-semibold text-success-content shadow-md'
                                            : 'text-base-content/80 hover:bg-base-200 hover:text-base-content'
                                    }`}
                                >
                                    <span
                                        className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                                            url === item.href
                                                ? 'bg-success-content/15 text-success-content'
                                                : 'bg-base-200 text-base-content/70'
                                        }`}
                                    >
                                        <Icon size={18} strokeWidth={2.2} />
                                    </span>
                                    <span className="text-sm font-medium tracking-[0.01em]">{item.label}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </aside>
    );
}

export default Sidebar;
