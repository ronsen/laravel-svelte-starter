### laravel-svelte-starter

Starter template using Laravel and Svelte.

This starter template includes:
- Laravel 13
- Svelte 5
- Inertia 3
- Tailwind CSS
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

To try this app, run these command:

```
composer run dev
```

### Deployment

Build the app:

```
npm run buid
```

Sign in with email `test@example.com` and password `password`.
