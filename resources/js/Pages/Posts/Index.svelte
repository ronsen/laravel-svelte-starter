<script>
    import { page, Link } from "@inertiajs/svelte";
    import { router } from '@inertiajs/svelte';
    import Layout from "../Layout.svelte";
    import Alert from "../Components/Alert.svelte";
    import Pagination from "../Components/Pagination.svelte";

    export let posts;

    function destroy(id) {
        if (confirm('Delete this post?')) {
            router.delete('/posts/' + id);
        }
    }
</script>

<svelte:head>
    <title>Laravel</title>
</svelte:head>

<Layout>
    {#if posts.data.length == 0}
        <Alert>Empty.</Alert>
    {:else}
        {#each posts.data as post}
            <div class="flex justify-between items-baseline border-b border-base-300 pb-2 mb-2">
                <div class="note-title">
                    <Link href="/posts/{post.id}">{post.title}</Link>
                </div>
                <div class="inline-flex gap-3">
                    <Link href="/posts/{post.id}/edit" title="Edit Post" class="text-gray-500"><i class="bi bi-pencil-square"></i></Link>
                    <button title="Delete Post" class="text-gray-500" on:click={destroy(post.id)}><i class="bi bi-trash"></i></button>
                </div>
            </div>
        {/each}

        <Pagination data={posts} />
    {/if}
</Layout>