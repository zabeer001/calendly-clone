import React from 'react';

function Footer({ role }) {
    return (
        <footer className="border-t border-base-300/50 bg-base-100/75 px-6 py-4 text-sm text-base-content/70">
            <p>Rimel Services Admin</p>
            <p className="mt-1">Role: {role.toUpperCase()}</p>
        </footer>
    );
}

export default Footer;
