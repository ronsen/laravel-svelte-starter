<script>
    import { inertia } from "@inertiajs/svelte";
    import { router } from '@inertiajs/svelte';
    import Layout from "../Layout.svelte";

    export let post;

    function destroy(id) {
        if (confirm('Delete this post?')) {
            router.delete('/posts/' + id);
        }
    }
</script>

<svelte:head>
    <title>{post.title}</title>
</svelte:head>

<Layout>
    <article>
        <div class="flex justify-between items-center border-b border-base-300 pb-3 mb-3">
            <div class="title font-bold">{post.title}</div>
            <div class="inline-flex gap-3">
                <a use:inertia href="/posts/{post.id}/edit" title="Edit Post" class="text-gray-500"><i class="bi bi-pencil-square"></i></a>
                <button title="Delete Post" class="text-gray-500" on:click={destroy(post.id)}><i class="bi bi-trash"></i></button>
            </div>
        </div>
    
        <div class="content prose max-w-none mb-3">
            {@html post.contentToHtml}
        </div>
    </article>    
</Layout>
