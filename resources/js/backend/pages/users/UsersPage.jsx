import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from '@inertiajs/react';

function UsersPage() {
    const userRole = useMemo(() => localStorage.getItem('role') || 'user', []);
    const initialFilters = useMemo(() => {
        const params = new URLSearchParams(window.location.search);

        return {
            updated: params.get('updated') === '1',
            search: params.get('search') || '',
            role: params.get('role') || 'all',
        };
    }, []);
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState(
        initialFilters.updated ? 'User updated successfully.' : '',
    );
    const [searchValue, setSearchValue] = useState(initialFilters.search);
    const [activeSearch, setActiveSearch] = useState(initialFilters.search);
    const [roleValue, setRoleValue] = useState(initialFilters.role);
    const [activeRole, setActiveRole] = useState(initialFilters.role);
    const didMountFilters = useRef(false);
    const roleOptions = ['all', 'user', 'admin', 'superadmin'];

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

    const loadUsers = async (search = '', role = 'all') => {
        setIsLoading(true);

        try {
            const createUsersUrl = (page) => {
                const params = new URLSearchParams({ page: String(page) });

                if (search) {
                    params.set('search', search);
                }

                if (role && role !== 'all') {
                    params.set('role', role);
                }

                return `/api/users?${params.toString()}`;
            };

            const firstPayload = await requestJson(createUsersUrl(1), {}, 'Failed to load users.');
            const firstPage = firstPayload?.data;
            const allUsers = Array.isArray(firstPage?.data) ? [...firstPage.data] : [];
            const currentPage = Number(firstPage?.current_page || 1);
            const lastPage = Number(firstPage?.last_page || 1);

            if (lastPage > currentPage) {
                const pageRequests = [];

                for (let page = currentPage + 1; page <= lastPage; page += 1) {
                    pageRequests.push(requestJson(createUsersUrl(page), {}, 'Failed to load users.'));
                }

                const pagePayloads = await Promise.all(pageRequests);

                for (const pagePayload of pagePayloads) {
                    const pageUsers = Array.isArray(pagePayload?.data?.data) ? pagePayload.data.data : [];
                    allUsers.push(...pageUsers);
                }
            }

            setUsers(allUsers);
            setError('');
        } catch (err) {
            setError(err.message || 'Failed to load users.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadUsers(initialFilters.search, initialFilters.role);
    }, [initialFilters]);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);

        if (params.get('created') === '1') {
            setMessage('User created successfully.');
        }
    }, []);

    const syncPageQuery = (search, role) => {
        const params = new URLSearchParams(window.location.search);

        if (search) {
            params.set('search', search);
        } else {
            params.delete('search');
        }

        if (role && role !== 'all') {
            params.set('role', role);
        } else {
            params.delete('role');
        }

        params.delete('updated');

        const query = params.toString();
        const nextUrl = query ? `/users?${query}` : '/users';
        window.history.replaceState({}, '', nextUrl);
    };

    useEffect(() => {
        if (!didMountFilters.current) {
            didMountFilters.current = true;
            return;
        }

        const nextSearch = searchValue.trim();
        const timeoutId = window.setTimeout(() => {
            setMessage('');
            setError('');
            setActiveSearch(nextSearch);
            setActiveRole(roleValue);
            syncPageQuery(nextSearch, roleValue);
            loadUsers(nextSearch, roleValue);
        }, 300);

        return () => window.clearTimeout(timeoutId);
    }, [roleValue, searchValue]);

    const onDeleteUser = async (user) => {
        const ok = window.confirm(`Delete ${user.name}?`);

        if (!ok) {
            return;
        }

        setError('');
        setMessage('');

        try {
            const payload = await requestJson(
                `/api/users/${user.id}`,
                { method: 'DELETE' },
                'Failed to delete user.',
            );

            setMessage(payload?.message || 'User deleted successfully.');
            await loadUsers(activeSearch, activeRole);
        } catch (err) {
            setError(err.message || 'Failed to delete user.');
        }
    };

    return (
        <div className="mx-auto max-w-7xl space-y-6">
            <section className="rounded-2xl border border-base-300/60 bg-base-100/75 p-6 shadow-xl backdrop-blur-lg">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <h1 className="text-3xl font-extrabold">Users</h1>
                        <p className="mt-2 text-sm text-base-content/70">
                            Manage your platform users here. Signed in as:{' '}
                            <span className="font-semibold uppercase">{userRole}</span>
                        </p>
                    </div>
                    <Link href="/users/create" className="btn btn-success">
                        Add User
                    </Link>
                </div>
            </section>

            <section className="rounded-2xl border border-base-300/60 bg-base-100/75 p-6 shadow-xl backdrop-blur-lg">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <h2 className="text-xl font-bold">User List</h2>
                    <div className="flex items-center gap-2">
                        <input
                            type="search"
                            className="input input-bordered input-sm w-72 bg-base-100 text-base-content placeholder:text-base-content/60"
                            placeholder="Search by user name or email"
                            value={searchValue}
                            onChange={(event) => setSearchValue(event.target.value)}
                        />
                        <select
                            className="select select-bordered select-sm"
                            value={roleValue}
                            onChange={(event) => setRoleValue(event.target.value)}
                        >
                            {roleOptions.map((role) => (
                                <option key={role} value={role}>
                                    {role === 'all' ? 'All roles' : role.toUpperCase()}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {message ? <p className="mb-3 text-sm text-success">{message}</p> : null}
                {isLoading ? <p className="text-sm text-base-content/70">Loading users...</p> : null}
                {error ? <p className="mb-3 text-sm text-error">{error}</p> : null}

                {!isLoading && !error ? (
                    <div className="overflow-x-auto rounded-xl border border-base-300/60">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="text-center text-base-content/70">
                                            No users found.
                                        </td>
                                    </tr>
                                ) : (
                                    users.map((user) => (
                                        <tr key={user.id}>
                                            <td>{user.id}</td>
                                            <td>{user.name}</td>
                                            <td>{user.email}</td>
                                            <td className="uppercase">{user.role || 'user'}</td>
                                            <td>
                                                <div className="flex flex-wrap gap-2">
                                                    <Link href={`/users/${user.id}`} className="btn btn-xs btn-outline">
                                                        Show
                                                    </Link>
                                                    <Link href={`/users/${user.id}/edit`} className="btn btn-xs btn-info btn-outline">
                                                        Edit
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        className="btn btn-xs btn-error btn-outline"
                                                        onClick={() => onDeleteUser(user)}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                ) : null}
            </section>
        </div>
    );
}

export default UsersPage;
