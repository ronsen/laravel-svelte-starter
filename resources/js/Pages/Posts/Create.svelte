<script>
    import { page, useForm } from "@inertiajs/svelte";
    import Layout from "../Layout.svelte";

    let form = useForm({
        title: null,
        content: null
    });

    function submit() {
        $form.post('/posts');
    }
</script>

<svelte:head>
    <title>Add New Post</title>
</svelte:head>

<Layout>
    <form on:submit|preventDefault={submit}>
        <input type="hidden" name="_token" value="{$page.props.csrfToken}">
        <div class="mb-3">
            <input type="text" bind:value={$form.title} placeholder="Title" class="input input-bordered w-full">
            {#if $form.errors.title}
                <div class="text-error text-sm font-bold mt-1">{$form.errors.title}</div>
            {/if}
        </div>
        <div class="mb-3">
            <textarea bind:value={$form.content} rows="5" placeholder="Content" class="textarea textarea-bordered w-full" />
        </div>
        <button type="submit" class="btn btn-primary" disabled={$form.processing}>Save</button>
    </form>
</Layout>
