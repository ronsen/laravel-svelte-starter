<script>
    import { page, Link, useForm } from "@inertiajs/svelte";
    import Layout from "../Layout.svelte";
    import Alert from "../Components/Alert.svelte";
    import Pagination from "../Components/Pagination.svelte";

    export let posts;
    let dialog;
    let post;
    let form = useForm();

    function destroy(p) {
        post = p;
        dialog.showModal();
    }

    function submit() {
        $form.delete('/posts/' + post.id);
        dialog.close();
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

                {#if $page.props.auth.user}
                    <div class="inline-flex gap-3">
                        <Link href="/posts/{post.id}/edit" title="Edit Post" class="text-gray-500"><i class="bi bi-pencil-square"></i></Link>
                        <button title="Delete Post" class="text-gray-500" on:click={() => destroy(post)}><i class="bi bi-trash"></i></button>
                    </div>
                {/if}
            </div>
        {/each}

        <Pagination data={posts} />
    {/if}
</Layout>

<dialog bind:this={dialog} class="w-full md:w-2/5 rounded-lg p-6">
    <form on:submit|preventDefault={submit}>
        <input type="hidden" bind:this={post}>
        Delete this post?

        <div class="flex justify-end gap-3 mt-3">
            <button type="submit" class="btn btn-error btn-sm">Yes</button>
            <button class="btn btn-neutral btn-sm" on:click|preventDefault={() => dialog.close()}>No</button>
        </div>
    </form>
</dialog>