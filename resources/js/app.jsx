import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import FrontendLayout from './frontend/layouts/FrontendLayout';
import BackendLayout from './backend/layouts/BackendLayout';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

const frontendPages = import.meta.glob('./frontend/pages/**/*.jsx');
const commonPages = import.meta.glob('./common/**/*.jsx');
const backendPages = import.meta.glob('./backend/pages/**/*.jsx');

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: async (name) => {
        if (name.startsWith('common/')) {
            const page = await resolvePageComponent(`./${name}.jsx`, commonPages);
            page.default.layout = page.default.layout || ((pageNode) => (
                pageNode.props.layoutContext === 'backend'
                    ? <BackendLayout>{pageNode}</BackendLayout>
                    : <FrontendLayout>{pageNode}</FrontendLayout>
            ));
            return page;
        }

        if (name.startsWith('frontend/')) {
            const page = await resolvePageComponent(`./${name}.jsx`, frontendPages);
            page.default.layout = page.default.layout || ((pageNode) => <FrontendLayout>{pageNode}</FrontendLayout>);
            return page;
        }

        try {
            const page = await resolvePageComponent(`./frontend/pages/${name}.jsx`, frontendPages);
            page.default.layout = page.default.layout || ((pageNode) => <FrontendLayout>{pageNode}</FrontendLayout>);
            return page;
        } catch {
            const page = await resolvePageComponent(`./backend/pages/${name}.jsx`, backendPages);
            page.default.layout = page.default.layout || ((pageNode) => <BackendLayout>{pageNode}</BackendLayout>);
            return page;
        }
    },
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});
