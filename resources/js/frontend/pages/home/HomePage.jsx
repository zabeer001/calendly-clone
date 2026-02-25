import React from 'react';

const companies = [
    { name: 'Northlane Digital', tag: 'Web + AI', score: '94%' },
    { name: 'CloudArc Studio', tag: 'Cloud Infra', score: '91%' },
    { name: 'PixelMint Agency', tag: 'Brand + UX', score: '89%' },
];

function HomePage() {
    return (
        <section className="mx-auto mt-20 max-w-4xl text-center">
                <div className="badge badge-success badge-outline mb-6 p-4 text-xs font-medium">
                    AI-driven company matching platform
                </div>

                <h1 className="text-4xl font-extrabold leading-tight sm:text-6xl bg-gradient-to-r from-primary via-primary to-primary bg-clip-text text-transparent">
                    Tell us what you need
                </h1>

                <p className="mx-auto mt-6 max-w-2xl text-base-content/75 text-lg">
                    Write your requirement and our AI will return the best matching
                    companies for your project.
                </p>

                <div className="card mt-10 border border-base-300/60 bg-base-100/80 p-6 shadow-2xl backdrop-blur-lg">
                    <p className="mb-3 text-sm font-semibold">
                        What are you looking for?
                    </p>

                    <textarea
                        className="textarea textarea-bordered h-36 w-full focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                        placeholder="Example: I need a Laravel + React agency in Bangladesh with strong API and dashboard delivery."
                    />

                    <div className="mt-5 flex flex-wrap justify-center gap-3 sm:justify-start">
                        <button className="btn btn-success px-6 shadow-lg hover:scale-105 transition-all">
                            Generate Companies
                        </button>
                        <button className="btn btn-outline">
                            Clear
                        </button>
                    </div>
                </div>

                <div className="mt-10 grid gap-4 text-left">
                    {companies.map((company) => (
                        <div
                            key={company.name}
                            className="flex items-center justify-between rounded-xl border border-base-300/50 bg-base-100/70 p-4 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                        >
                            <div>
                                <p className="font-semibold text-lg">
                                    {company.name}
                                </p>
                                <p className="text-xs text-base-content/60">
                                    {company.tag}
                                </p>
                            </div>
                            <div className="badge badge-success badge-lg">
                                {company.score}
                            </div>
                        </div>
                    ))}
                </div>
        </section>
    );
}

export default HomePage;
