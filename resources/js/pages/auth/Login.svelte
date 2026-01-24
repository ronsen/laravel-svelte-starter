<script lang="ts">
    import { Form } from "@inertiajs/svelte";
    import App from "@/layouts/App.svelte";
</script>

<svelte:head>
    <title>Log In</title>
</svelte:head>

<App>
    <Form action="/login" method="post">
        {#snippet children(
            { errors }: { errors: Record<string, string> },
            processing: boolean,
        )}
            <div class="mb-3">
                <input
                    type="email"
                    name="email"
                    placeholder="E-mail"
                    class="rounded-lg dark:bg-zinc-800 w-full"
                />
                {#if errors.email}
                    <div class="text-red-500 text-sm mt-1">
                        {errors.email}
                    </div>
                {/if}
            </div>
            <div class="mb-3">
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    class="rounded-lg dark:bg-zinc-800 w-full"
                />
                {#if errors.password}
                    <div class="text-red-500 text-sm mt-1">
                        {errors.password}
                    </div>
                {/if}
            </div>
            <button
                type="submit"
                class="p-2 border border-zinc-500 rounded-lg text-sm cursor-pointer w-full"
                >Log In</button
            >
        {/snippet}
    </Form>
</App>
