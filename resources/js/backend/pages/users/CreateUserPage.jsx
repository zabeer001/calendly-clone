import React, { useMemo, useState } from 'react';
import { Link } from '@inertiajs/react';

function CreateUserPage() {
    const userRole = useMemo(() => localStorage.getItem('role') || 'user', []);
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
                '/api/users',
                {
                    method: 'POST',
                    body: JSON.stringify(form),
                },
                'Failed to create user.',
            );

            window.location.href = '/users?created=1';
        } catch (err) {
            setError(err.message || 'Failed to create user.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="mx-auto max-w-7xl space-y-6">
            <section className="rounded-2xl border border-base-300/60 bg-base-100/75 p-6 shadow-xl backdrop-blur-lg">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="text-3xl font-extrabold">Add User</h1>
                        <p className="mt-2 text-sm text-base-content/70">
                            Create a new platform user. Signed in as:{' '}
                            <span className="font-semibold uppercase">{userRole}</span>
                        </p>
                    </div>
                    <Link href="/users" className="btn btn-outline">
                        Back
                    </Link>
                </div>
            </section>

            <section className="rounded-2xl border border-base-300/60 bg-base-100/75 p-6 shadow-xl backdrop-blur-lg">
                {error ? <p className="mb-4 text-sm text-error">{error}</p> : null}

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
                        <span className="label-text mb-2">Password</span>
                        <input
                            type="password"
                            name="password"
                            className="input input-bordered w-full"
                            value={form.password}
                            onChange={onFieldChange}
                            required
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
                            required
                        />
                    </label>

                    <div className="md:col-span-2">
                        <button type="submit" className="btn btn-success" disabled={isSaving}>
                            {isSaving ? 'Creating...' : 'Create User'}
                        </button>
                    </div>
                </form>
            </section>
        </div>
    );
}

export default CreateUserPage;
