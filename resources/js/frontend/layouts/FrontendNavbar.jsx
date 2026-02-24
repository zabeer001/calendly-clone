import React from 'react';

function FrontendNavbar({ themes, theme, setTheme }) {
    return (
        <header className="navbar rounded-2xl border border-base-300/50 bg-base-100/70 shadow-lg backdrop-blur-xl">
            <div className="navbar-start">
                <a className="text-xl font-bold tracking-wide bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">
                    Rimel Services
                </a>
            </div>

            <div className="navbar-center hidden lg:flex text-sm text-base-content/70">
                AI company matching platform
            </div>

            <div className="navbar-end gap-2">
                {themes.map((item) => (
                    <button
                        key={item.value}
                        type="button"
                        className={`btn btn-sm transition-all duration-300 ${
                            theme === item.value
                                ? 'btn-success shadow-lg shadow-green-500/40'
                                : 'btn-ghost hover:bg-base-200'
                        }`}
                        onClick={() => setTheme(item.value)}
                    >
                        {item.label}
                    </button>
                ))}
            </div>
        </header>
    );
}

export default FrontendNavbar;
