<script lang="ts">
    import { page, Link, inertia } from "@inertiajs/svelte";
    import { CircleAlert, CirclePlus, LogIn, LogOut } from "@lucide/svelte";
    import type { Snippet } from "svelte";
    import Theme from "@/components/Theme.svelte";
    import * as Alert from "@/components/ui/alert";
    import { ModeWatcher } from "mode-watcher";

    let { children }: { children: Snippet } = $props();
</script>

<ModeWatcher />

<main class="mx-auto max-w-2xl my-6 px-6 md:my-12">
    <nav
        class="flex justify-between items-center border-b pb-2 mb-8"
    >
        <h1 class="font-bold">
            <Link href="/">{page.props.name}</Link>
        </h1>

        <div class="inline-flex items-center gap-3">
            <Theme />

            {#if page.props.auth.user}
                <Link href="/posts/create"><CirclePlus size={16} /></Link>
                <button
                    use:inertia={{ href: "/logout", method: "post" }}
                    class="cursor-pointer"><LogOut size={16} /></button
                >
            {/if}

            {#if !page.props.auth.user}
                <Link href="/login"><LogIn size={16} /></Link>
            {/if}
        </div>
    </nav>

    {#if page.props.flash}
        <div class="grid w-full items-start gap-4 mb-4">
            <Alert.Root>
                <CircleAlert />
                <Alert.Description>
                    {@html page.props.flash}
                </Alert.Description>
            </Alert.Root>
        </div>
    {/if}

    {@render children()}
</main>
