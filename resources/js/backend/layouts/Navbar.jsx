import React from 'react';

function Navbar({ theme, setTheme, signOut }) {
    return (
        <header className="navbar border-b border-base-300/50 bg-base-100/80 px-4 shadow-sm backdrop-blur-md sm:px-6">
            <div className="flex-none lg:hidden">
                <label htmlFor="admin-drawer" className="btn btn-square btn-ghost">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
                    </svg>
                </label>
            </div>

            <div className="flex-1">
                <h1 className="text-xl font-bold tracking-wide">Admin Panel</h1>
            </div>

            <div className="flex items-center gap-2">
                <div className="join hidden sm:inline-flex">
                    <button
                        type="button"
                        className={`join-item btn btn-sm ${theme === 'forest' ? 'btn-success' : 'btn-outline'}`}
                        onClick={() => setTheme('forest')}
                    >
                        Forest
                    </button>
                    <button
                        type="button"
                        className={`join-item btn btn-sm ${theme === 'light' ? 'btn-success' : 'btn-outline'}`}
                        onClick={() => setTheme('light')}
                    >
                        White
                    </button>
                </div>
                <button type="button" className="btn btn-sm btn-error btn-outline" onClick={signOut}>
                    Sign out
                </button>
            </div>
        </header>
    );
}

export default Navbar;
