<script lang="ts">
    import { page, Link, inertia } from "@inertiajs/svelte";
    import { CirclePlus, LogIn, LogOut } from "@lucide/svelte";
    import type { Snippet } from "svelte";
    import Alert from "@/components/Alert.svelte";
    import Theme from "@/components/Theme.svelte";

    let { children }: { children: Snippet } = $props();
</script>

<main class="mx-auto max-w-2xl my-6 px-6 md:my-12">
    <nav
        class="flex justify-between items-center border-b dark:border-zinc-700 pb-2 mb-8"
    >
        <h1 class="font-bold">
            <Link href="/">{$page.props.name}</Link>
        </h1>

        <div class="inline-flex gap-3">
            <Theme />

            {#if $page.props.auth}
                <Link href="/posts/create"><CirclePlus size={16} /></Link>
                <button
                    use:inertia={{ href: "/logout", method: "post" }}
                    class="cursor-pointer"><LogOut size={16} /></button
                >
            {/if}

            {#if !$page.props.auth}
                <Link href="/login"><LogIn size={16} /></Link>
            {/if}
        </div>
    </nav>

    {#if $page.props.flash}
        <Alert>{@html $page.props.flash}</Alert>
    {/if}

    {@render children()}
</main>
