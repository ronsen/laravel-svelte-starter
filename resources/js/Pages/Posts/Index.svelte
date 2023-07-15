<script>
    import { inertia } from "@inertiajs/svelte";
    import Layout from "../Layout.svelte";
    import Alert from "../Components/Alert.svelte";

    export let posts;

    console.log(posts);
</script>

<svelte:head>
    <title>Laravel</title>
</svelte:head>

<Layout>
    {#if posts.length == 0}
        <Alert>Empty.</Alert>
    {:else}
        {#each posts.data as post}
            <div class="flex justify-between items-baseline border-b border-base-300 pb-2 mb-2">
                <div class="note-title">
                    <a use:inertia href="/posts/{post.id}/{post.slug}">{post.title}</a>
                </div>
                <div class="inline-flex gap-3">
                    <a use:inertia href="/posts/{post.id}/edit" title="Edit Note" class="text-gray-500"><i class="bi bi-pencil-square"></i></a>
                    <a use:inertia href="/posts/{post.id}/delete" title="Delete Note" class="text-gray-500"><i class="bi bi-trash"></i></a>
                </div>
            </div>
        {/each}
    {/if}
</Layout>