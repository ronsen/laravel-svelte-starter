<script context="module">
    export { default as layout } from "../Layouts/App.svelte";
</script>

<script>
    import { useForm } from "@inertiajs/svelte";

    export let post;

    let form = useForm({
        title: post.title,
        content: post.content
    });

    function submit() {
        $form.patch('/posts/' + post.id);
    }
</script>

<svelte:head>
    <title>Edit Post</title>
</svelte:head>

<form on:submit|preventDefault={submit}>
    <div class="mb-3">
        <input type="text" bind:value={$form.title} placeholder="Title" class="input input-bordered w-full">
        {#if $form.errors.title}
            <div class="text-error font-bold text-sm mt-1">{$form.errors.title}</div>
        {/if}
    </div>
    <div class="mb-3">
        <textarea bind:value={$form.content} rows="10" placeholder="Content" class="textarea textarea-bordered w-full" />
    </div>
    <button type="submit" class="btn btn-primary" disabled={$form.processing}>Save</button>
</form>
