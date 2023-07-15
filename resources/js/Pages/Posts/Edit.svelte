<script>
    import Layout from "../Layout.svelte";

    export let post;
    export let csrfToken;
</script>

<svelte:head>
    <title>Edit Post</title>
</svelte:head>

<Layout>
    <form action="/posts/{post.id}" method="post">
        <input type="hidden" name="_token" value="{csrfToken}">
        <input type="hidden" name="_method" value="patch">
        <div class="mb-3">
            <input type="text" name="title" value={post.title} placeholder="Title" class="input input-bordered w-full" required>
        </div>
        <div class="mb-3">
            <textarea name="content" rows="10" placeholder="Content" class="textarea textarea-bordered w-full">{post.content}</textarea>
        </div>
        <button type="submit" class="btn btn-primary">Save</button>
    </form>
</Layout>
