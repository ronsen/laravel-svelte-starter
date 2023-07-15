<script>
    import Layout from "../Layout.svelte";

    export let csrfToken;
</script>

<svelte:head>
    <title>Add New Post</title>
</svelte:head>

<Layout>
    <form action="/posts" method="post">
        <input type="hidden" name="_token" value="{csrfToken}">
        <div class="mb-3">
            <input type="text" name="title" placeholder="Title" class="input input-bordered w-full" required>
        </div>
        <div class="mb-3">
            <textarea name="content" rows="5" placeholder="Content" class="textarea textarea-bordered w-full"></textarea>
        </div>
        <button type="submit" class="btn btn-primary">Save</button>
    </form>
</Layout>
