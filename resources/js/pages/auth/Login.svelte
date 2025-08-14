<script lang="ts">
    import { useForm } from "@inertiajs/svelte";
    import App from "../layouts/App.svelte";

    let form = useForm({
        email: "",
        password: "",
    });

    function submit(e: SubmitEvent) {
        e.preventDefault();
        $form.post("/login", {
            onFinish: () => $form.reset("password"),
        });
    }
</script>

<svelte:head>
    <title>Log In</title>
</svelte:head>

<App>
    <form onsubmit={submit}>
        <div class="mb-3">
            <input
                type="email"
                bind:value={$form.email}
                placeholder="E-mail"
                class="rounded-lg dark:bg-zinc-800 w-full"
            />
            {#if $form.errors.email}
                <div class="text-red-500 text-sm mt-1">
                    {$form.errors.email}
                </div>
            {/if}
        </div>
        <div class="mb-3">
            <input
                type="password"
                bind:value={$form.password}
                placeholder="Password"
                class="rounded-lg dark:bg-zinc-800 w-full"
            />
            {#if $form.errors.password}
                <div class="text-red-500 text-sm mt-1">
                    {$form.errors.password}
                </div>
            {/if}
        </div>
        <button
            type="submit"
            class="p-2 border border-zinc-500 rounded-lg text-sm cursor-pointer"
            disabled={$form.processing}>Log In</button
        >
    </form>
</App>
