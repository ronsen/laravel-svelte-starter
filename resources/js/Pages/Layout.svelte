<script>
    import { Link } from "@inertiajs/svelte";
</script>

<main class="flex justify-between items-center border-b border-primary pb-2 mb-8">
    <h1 class="font-bold uppercase"><Link href="/">Laravel</Link></h1>

    <Link href="/posts/create"><i class="bi bi-plus-circle"></i></Link>
</main>

<slot />