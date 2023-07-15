<script>
    import { inertia } from "@inertiajs/svelte";
</script>

<main class="flex justify-between items-center border-b border-primary pb-2 mb-8">
    <h1 class="font-bold uppercase"><a use:inertia href="/">Laravel</a></h1>

    <a use:inertia href="/posts/create"><i class="bi bi-plus-circle"></i></a>
</main>

<slot />