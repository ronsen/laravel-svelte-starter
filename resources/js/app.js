import { createInertiaApp } from '@inertiajs/svelte';
import '../css/app.css';

createInertiaApp({
    id: 'app',
    resolve: name => {
        const pages = import.meta.glob('./Pages/**/*.svelte', { eager: true });
        return pages[`./Pages/${name}.svelte`];
    },
    setup({ el, App }) {
        new App({ target: el, hydrate: true });
    },
})