import React, { useMemo, useState } from 'react';
import Footer from './Footer';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

function BackendLayout({ children }) {
    const [theme, setTheme] = useState('forest');
    const role = useMemo(() => localStorage.getItem('role') || 'admin', []);

    const signOut = async () => {
        const token = localStorage.getItem('access_token');

        try {
            if (token) {
                await fetch('/api/signout', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });
            }
        } catch (error) {
            console.error('Sign out request failed:', error);
        } finally {
            localStorage.removeItem('access_token');
            localStorage.removeItem('role');
            window.location.href = '/sign-in';
        }
    };

    return (
        <main
            data-theme={theme}
            className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-300 text-base-content"
        >
            <div className="drawer lg:drawer-open">
                <input id="admin-drawer" type="checkbox" className="drawer-toggle" />

                <div className="drawer-content flex min-h-screen flex-col">
                    <Navbar theme={theme} setTheme={setTheme} signOut={signOut} />

                    <div className="flex-1 p-4 sm:p-6 lg:p-8">{children}</div>

                    <Footer role={role} />
                </div>

                <Sidebar />
            </div>
        </main>
    );
}

export default BackendLayout;
