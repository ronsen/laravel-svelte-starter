## laravel-svelte-starter

Starter template using Laravel and Svelte.

This starter template includes:
- Laravel 11
- Svelte
- Inertia.js
- Vite
- Tailwind CSS
- daisyUI
- sqlite

### Installation

Run following commands:

```
composer install
npm install
cp .env.example .env
php artisan key:generate
```

Migrate database:

```
php artisan migrate --seed
```

To try this app, run these commands on seperate terminal:

```
npm run dev
php artisan serve
```

### Deployment

Build the app:

```
npm run buid
```


