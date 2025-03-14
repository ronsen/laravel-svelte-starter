## laravel-svelte-starter

Starter template using Laravel and Svelte.

This starter template includes:
- Laravel 12
- Svelte 5
- Inertia 2
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

### Docker

Installation using Docker:

```
docker build -t laravel-svelte-starter .
docker run -p 8000:8000 -d laravel-svelte-starter
```
Open `http://localhost:8000/` on your browser.
