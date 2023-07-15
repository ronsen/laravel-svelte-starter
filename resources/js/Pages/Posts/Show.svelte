<script>
    import Layout from "../Layout.svelte";

    export let post;
</script>

<svelte:head>
    <title>{post.title}</title>
</svelte:head>

<Layout>
    <article>
        <div class="flex justify-between items-center border-b border-base-300 pb-3 mb-3">
            <div class="title font-bold">{post.title}</div>
            <div class="inline-flex gap-3">
                <a href="/posts/{post.id}/edit" title="Edit Post" class="text-gray-500"><i class="bi bi-pencil-square"></i></a>
                <a href="/posts/{post.id}/delete" title="Delete Post" class="text-gray-500"><i class="bi bi-trash"></i></a>
            </div>
        </div>
    
        <div class="content prose max-w-none mb-3">
            {@html post.contentToHtml}
        </div>
    </article>    
</Layout>
