import React, { useEffect, useMemo, useState } from 'react';
import { Link, usePage } from '@inertiajs/react';

function EditUserPage() {
    const { userId } = usePage().props;
    const userRole = useMemo(() => localStorage.getItem('role') || 'user', []);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    const [form, setForm] = useState({
        name: '',
        email: '',
        role: 'user',
        password: '',
        password_confirmation: '',
    });

    const getErrorMessage = (payload, fallbackMessage) => {
        if (payload?.message) {
            return payload.message;
        }

        const firstValidationError = Object.values(payload?.errors || {})[0];

        if (Array.isArray(firstValidationError) && firstValidationError[0]) {
            return firstValidationError[0];
        }

        return fallbackMessage;
    };

    const requestJson = async (url, options = {}, fallbackMessage = 'Request failed.') => {
        const token = localStorage.getItem('access_token');

        if (!token) {
            throw new Error('No access token found. Please sign in again.');
        }

        const response = await fetch(url, {
            ...options,
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`,
                ...(options.body ? { 'Content-Type': 'application/json' } : {}),
                ...(options.headers || {}),
            },
        });

        let payload = null;

        try {
            payload = await response.json();
        } catch (parseError) {
            payload = null;
        }

        if (!response.ok) {
            throw new Error(getErrorMessage(payload, fallbackMessage));
        }

        return payload;
    };

    useEffect(() => {
        const loadUser = async () => {
            setIsLoading(true);

            try {
                const payload = await requestJson(`/api/users/${userId}`, {}, 'Failed to load user.');
                const loadedUser = payload?.data || null;

                setUser(loadedUser);
                setForm({
                    name: loadedUser?.name || '',
                    email: loadedUser?.email || '',
                    role: loadedUser?.role || 'user',
                    password: '',
                    password_confirmation: '',
                });
                setError('');
            } catch (err) {
                setError(err.message || 'Failed to load user.');
            } finally {
                setIsLoading(false);
            }
        };

        loadUser();
    }, [userId]);

    const onFieldChange = (event) => {
        const { name, value } = event.target;

        setForm((current) => ({
            ...current,
            [name]: value,
        }));
    };

    const onSubmit = async (event) => {
        event.preventDefault();
        setIsSaving(true);
        setError('');

        try {
            await requestJson(
                `/api/users/${userId}`,
                {
                    method: 'PUT',
                    body: JSON.stringify(form),
                },
                'Failed to update user.',
            );

            window.location.href = '/users?updated=1';
        } catch (err) {
            setError(err.message || 'Failed to update user.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="mx-auto max-w-7xl space-y-6">
            <section className="rounded-2xl border border-base-300/60 bg-base-100/75 p-6 shadow-xl backdrop-blur-lg">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="text-3xl font-extrabold">Edit User</h1>
                        <p className="mt-2 text-sm text-base-content/70">
                            Update this user record. Signed in as: <span className="font-semibold uppercase">{userRole}</span>
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Link href="/users" className="btn btn-outline">Back</Link>
                        <Link href={`/users/${userId}`} className="btn btn-ghost">View</Link>
                    </div>
                </div>
            </section>

            <section className="rounded-2xl border border-base-300/60 bg-base-100/75 p-6 shadow-xl backdrop-blur-lg">
                {isLoading ? <p className="text-sm text-base-content/70">Loading user...</p> : null}
                {error ? <p className="text-sm text-error">{error}</p> : null}

                {!isLoading && !error && user ? (
                    <form className="grid gap-4 md:grid-cols-2" onSubmit={onSubmit}>
                        <label className="form-control w-full">
                            <span className="label-text mb-2">Name</span>
                            <input
                                type="text"
                                name="name"
                                className="input input-bordered w-full"
                                value={form.name}
                                onChange={onFieldChange}
                                required
                            />
                        </label>

                        <label className="form-control w-full">
                            <span className="label-text mb-2">Email</span>
                            <input
                                type="email"
                                name="email"
                                className="input input-bordered w-full"
                                value={form.email}
                                onChange={onFieldChange}
                                required
                            />
                        </label>

                        <label className="form-control w-full">
                            <span className="label-text mb-2">Role</span>
                            <select
                                name="role"
                                className="select select-bordered w-full"
                                value={form.role}
                                onChange={onFieldChange}
                            >
                                <option value="admin">Admin</option>
                                <option value="editor">Editor</option>
                                <option value="user">User</option>
                            </select>
                        </label>

                        <div className="hidden md:block" />

                        <label className="form-control w-full">
                            <span className="label-text mb-2">New Password</span>
                            <input
                                type="password"
                                name="password"
                                className="input input-bordered w-full"
                                value={form.password}
                                onChange={onFieldChange}
                                placeholder="Leave blank to keep current password"
                            />
                        </label>

                        <label className="form-control w-full">
                            <span className="label-text mb-2">Confirm Password</span>
                            <input
                                type="password"
                                name="password_confirmation"
                                className="input input-bordered w-full"
                                value={form.password_confirmation}
                                onChange={onFieldChange}
                                placeholder="Only required when changing password"
                            />
                        </label>

                        <div className="md:col-span-2">
                            <button type="submit" className="btn btn-success" disabled={isSaving}>
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                ) : null}
            </section>
        </div>
    );
}

export default EditUserPage;
