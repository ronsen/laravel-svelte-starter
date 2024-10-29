<script context="module">
    export { default as layout } from "../Layouts/App.svelte";
</script>

<script>
    import { useForm } from "@inertiajs/svelte";

    export let post;

    let form = useForm({
        title: post.title,
        content: post.content,
    });

    function submit() {
        $form.patch("/posts/" + post.id);
    }
</script>

<svelte:head>
    <title>Edit Post</title>
</svelte:head>

<form on:submit|preventDefault={submit}>
    <div class="mb-3">
        <input
            type="text"
            bind:value={$form.title}
            placeholder="Title"
            class="p-2 border rounded-lg w-full shadow-sm dark:bg-zinc-900 dark:border-zinc-500"
        />
        {#if $form.errors.title}
            <div class="text-red-500 font-bold text-sm mt-1">
                {$form.errors.title}
            </div>
        {/if}
    </div>
    <div class="mb-3">
        <textarea
            bind:value={$form.content}
            rows="10"
            placeholder="Content"
            class="p-2 border rounded-lg w-full shadow-sm dark:bg-zinc-900 dark:border-zinc-500"
        />
    </div>
    <button
        type="submit"
        class="p-2 border rounded-lg text-sm shadow-sm hover:bg-zinc-100 dark:border-zinc-500 dark:hover:bg-zinc-800"
        disabled={$form.processing}>Save</button
    >
</form>
