import React, { useEffect, useMemo, useState } from 'react';
import { clearSession, getAccessToken, refreshToken, apiRequest } from '../../shared/apiClient';
import Footer from './Footer';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

function BackendLayout({ children }) {
    const [theme, setTheme] = useState('forest');
    const role = useMemo(() => localStorage.getItem('role') || 'admin', []);

    useEffect(() => {
        const bootAuth = async () => {
            const token = getAccessToken();

            if (!token) {
                window.location.href = '/';
                return;
            }

            try {
                await refreshToken();
            } catch (error) {
                clearSession();
                window.location.href = '/';
            }
        };

        bootAuth();
    }, []);

    const signOut = async () => {
        try {
            await apiRequest('/api/signout', { method: 'POST', auth: true });
        } catch (error) {
            console.error('Sign out request failed:', error);
        } finally {
            clearSession();
            window.location.href = '/';
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
