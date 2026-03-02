import React, { useEffect, useMemo, useState } from 'react';
import { Link, usePage } from '@inertiajs/react';

function ShowUserPage() {
    const { userId } = usePage().props;
    const userRole = useMemo(() => localStorage.getItem('role') || 'user', []);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const requestJson = async (url, fallbackMessage = 'Request failed.') => {
        const token = localStorage.getItem('access_token');

        if (!token) {
            throw new Error('No access token found. Please sign in again.');
        }

        const response = await fetch(url, {
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        let payload = null;

        try {
            payload = await response.json();
        } catch (parseError) {
            payload = null;
        }

        if (!response.ok) {
            throw new Error(payload?.message || fallbackMessage);
        }

        return payload;
    };

    useEffect(() => {
        const loadUser = async () => {
            setIsLoading(true);

            try {
                const payload = await requestJson(`/api/users/${userId}`, 'Failed to load user details.');
                setUser(payload?.data || null);
                setError('');
            } catch (err) {
                setError(err.message || 'Failed to load user details.');
            } finally {
                setIsLoading(false);
            }
        };

        loadUser();
    }, [userId]);

    return (
        <div className="mx-auto max-w-7xl space-y-6">
            <section className="rounded-2xl border border-base-300/60 bg-base-100/75 p-6 shadow-xl backdrop-blur-lg">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="text-3xl font-extrabold">User Details</h1>
                        <p className="mt-2 text-sm text-base-content/70">
                            Review this user record. Signed in as: <span className="font-semibold uppercase">{userRole}</span>
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Link href="/users" className="btn btn-outline">Back</Link>
                        <Link href={`/users/${userId}/edit`} className="btn btn-info btn-outline">Edit</Link>
                    </div>
                </div>
            </section>

            <section className="rounded-2xl border border-base-300/60 bg-base-100/75 p-6 shadow-xl backdrop-blur-lg">
                {isLoading ? <p className="text-sm text-base-content/70">Loading user...</p> : null}
                {error ? <p className="text-sm text-error">{error}</p> : null}

                {!isLoading && !error && user ? (
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="rounded-xl border border-base-300/60 bg-base-200/40 p-4">
                            <p className="text-xs uppercase text-base-content/60">User ID</p>
                            <p className="mt-1 text-lg font-semibold">{user.id}</p>
                        </div>
                        <div className="rounded-xl border border-base-300/60 bg-base-200/40 p-4">
                            <p className="text-xs uppercase text-base-content/60">Role</p>
                            <p className="mt-1 text-lg font-semibold uppercase">{user.role || 'user'}</p>
                        </div>
                        <div className="rounded-xl border border-base-300/60 bg-base-200/40 p-4">
                            <p className="text-xs uppercase text-base-content/60">Name</p>
                            <p className="mt-1 text-lg font-semibold">{user.name}</p>
                        </div>
                        <div className="rounded-xl border border-base-300/60 bg-base-200/40 p-4">
                            <p className="text-xs uppercase text-base-content/60">Email</p>
                            <p className="mt-1 text-lg font-semibold">{user.email}</p>
                        </div>
                        <div className="rounded-xl border border-base-300/60 bg-base-200/40 p-4 md:col-span-2">
                            <p className="text-xs uppercase text-base-content/60">Created</p>
                            <p className="mt-1 text-lg font-semibold">
                                {user.created_at ? new Date(user.created_at).toLocaleString() : '-'}
                            </p>
                        </div>
                    </div>
                ) : null}
            </section>
        </div>
    );
}

export default ShowUserPage;
