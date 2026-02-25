import React, { useEffect, useMemo, useState } from 'react';

function UsersPage() {
    const userRole = useMemo(() => localStorage.getItem('role') || 'user', []);
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadUsers = async () => {
            const token = localStorage.getItem('access_token');

            if (!token) {
                setError('No access token found. Please sign in again.');
                setIsLoading(false);
                return;
            }

            try {
                const headers = {
                    Accept: 'application/json',
                    Authorization: `Bearer ${token}`,
                };

                const firstResponse = await fetch('/api/users?page=1', { headers });
                const firstPayload = await firstResponse.json();

                if (!firstResponse.ok) {
                    throw new Error(firstPayload?.message || 'Failed to load users.');
                }

                const firstPage = firstPayload?.data;
                const allUsers = Array.isArray(firstPage?.data) ? [...firstPage.data] : [];
                const currentPage = Number(firstPage?.current_page || 1);
                const lastPage = Number(firstPage?.last_page || 1);

                if (lastPage > currentPage) {
                    const pageRequests = [];

                    for (let page = currentPage + 1; page <= lastPage; page += 1) {
                        pageRequests.push(fetch(`/api/users?page=${page}`, { headers }));
                    }

                    const pageResponses = await Promise.all(pageRequests);

                    for (const pageResponse of pageResponses) {
                        const pagePayload = await pageResponse.json();

                        if (!pageResponse.ok) {
                            throw new Error(pagePayload?.message || 'Failed to load users.');
                        }

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

        loadUsers();
    }, []);

    return (
        <div className="mx-auto max-w-7xl">
            <section className="rounded-2xl border border-base-300/60 bg-base-100/75 p-6 shadow-xl backdrop-blur-lg">
                <h1 className="text-3xl font-extrabold">Users</h1>
                <p className="mt-2 text-sm text-base-content/70">
                    Manage your platform users here. Signed in as: <span className="font-semibold uppercase">{userRole}</span>
                </p>

                {isLoading && <p className="mt-6 text-sm text-base-content/70">Loading users...</p>}
                {error && <p className="mt-6 text-sm text-error">{error}</p>}

                {!isLoading && !error && (
                    <div className="mt-6 overflow-x-auto rounded-xl border border-base-300/60">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="text-center text-base-content/70">
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
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </div>
    );
}

export default UsersPage;
