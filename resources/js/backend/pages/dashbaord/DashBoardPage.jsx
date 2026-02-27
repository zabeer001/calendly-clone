import React, { useEffect, useMemo } from 'react';

const kpiCards = [
    { title: 'Revenue', value: '$48,290', delta: '+12.4%', tone: 'success' },
    { title: 'New Clients', value: '128', delta: '+8.1%', tone: 'info' },
    { title: 'Booked Calls', value: '74', delta: '+5.3%', tone: 'warning' },
    { title: 'Conversion', value: '36.2%', delta: '+2.6%', tone: 'secondary' },
];

const projectRows = [
    { name: 'AI Match Engine', owner: 'Rahim', status: 'On Track', progress: 78, badge: 'success' },
    { name: 'Client Portal', owner: 'Nila', status: 'Review', progress: 61, badge: 'warning' },
    { name: 'API Gateway', owner: 'Sohan', status: 'Delayed', progress: 42, badge: 'error' },
    { name: 'Design System', owner: 'Mahi', status: 'On Track', progress: 85, badge: 'success' },
];

const activityRows = [
    { text: 'New lead added from landing page', time: '5m ago' },
    { text: 'Services proposal sent', time: '22m ago' },
    { text: 'Quarterly report exported', time: '1h ago' },
    { text: 'User role updated to admin', time: '2h ago' },
];

function DashBoardPage() {
    const userRole = useMemo(() => localStorage.getItem('role') || 'user', []);

    useEffect(() => {
        const token = localStorage.getItem('access_token');

        if (!token) {
            window.location.href = '/';
        }
    }, []);

    return (
        <div className="mx-auto max-w-7xl">
            <section className="mb-6 rounded-2xl border border-base-300/60 bg-base-100/75 p-4 shadow-xl backdrop-blur-lg">
                <h1 className="bg-gradient-to-r from-success via-success to-emerald-400 bg-clip-text text-3xl font-extrabold text-transparent">
                    Dashboard Overview
                </h1>
                <p className="mt-1 text-sm text-base-content/70">
                    Welcome back. Role: <span className="font-semibold uppercase">{userRole}</span>
                </p>
            </section>

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {kpiCards.map((item) => (
                    <article
                        key={item.title}
                        className="card border border-base-300/50 bg-base-100/80 shadow-lg transition-transform duration-300 hover:-translate-y-1"
                    >
                        <div className="card-body">
                            <p className="text-xs uppercase tracking-wider text-base-content/60">{item.title}</p>
                            <h2 className="text-3xl font-bold">{item.value}</h2>
                            <div className={`badge badge-${item.tone} badge-outline`}>{item.delta}</div>
                        </div>
                    </article>
                ))}
            </section>

            <section className="mt-6 grid gap-6 lg:grid-cols-3">
                <article className="card border border-base-300/50 bg-base-100/80 shadow-xl lg:col-span-2">
                    <div className="card-body">
                        <div className="mb-2 flex items-center justify-between">
                            <h3 className="text-xl font-bold">Projects Health</h3>
                            <button type="button" className="btn btn-ghost btn-sm">
                                View all
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="table table-zebra">
                                <thead>
                                    <tr>
                                        <th>Project</th>
                                        <th>Owner</th>
                                        <th>Status</th>
                                        <th>Progress</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {projectRows.map((row) => (
                                        <tr key={row.name}>
                                            <td className="font-semibold">{row.name}</td>
                                            <td>{row.owner}</td>
                                            <td>
                                                <span className={`badge badge-${row.badge} badge-outline`}>
                                                    {row.status}
                                                </span>
                                            </td>
                                            <td className="w-44">
                                                <progress
                                                    className={`progress progress-${row.badge} w-full`}
                                                    value={row.progress}
                                                    max="100"
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </article>

                <article className="card border border-base-300/50 bg-base-100/80 shadow-xl">
                    <div className="card-body">
                        <h3 className="text-xl font-bold">Live Activity</h3>
                        <ul className="mt-2 space-y-3">
                            {activityRows.map((item) => (
                                <li
                                    key={`${item.text}-${item.time}`}
                                    className="rounded-xl border border-base-300/40 bg-base-200/50 p-3"
                                >
                                    <p className="text-sm">{item.text}</p>
                                    <p className="mt-1 text-xs text-base-content/60">{item.time}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </article>
            </section>
        </div>
    );
}

export default DashBoardPage;
