<script>
    import { page, Link, useForm } from "@inertiajs/svelte";
    import Alert from "../Components/Alert.svelte";
    import Pagination from "../Components/Pagination.svelte";
    import App from "../Layouts/App.svelte";

    export let posts;
    let dialog;
    let post;
    let form = useForm();

    function destroy(p) {
        post = p;
        dialog.showModal();
    }

    function submit() {
        $form.delete(`/posts/${post.id}`);
        dialog.close();
    }
</script>

<svelte:head>
    <title>{$page.props.appName}</title>
</svelte:head>

<App>
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
</App>

<dialog bind:this={dialog} class="modal">
    <form on:submit|preventDefault={submit} class="modal-box">
        <input type="hidden" bind:this={post}>
        <h3 class="font-bold text-lg">Confirm</h3>
        <p class="py-4">Delete this post?</p>

        <div class="modal-action">
            <button class="btn btn-neutral btn-sm" on:click|preventDefault={() => dialog.close()}>No</button>
            <button type="submit" class="btn btn-error btn-sm">Yes</button>
        </div>
    </form>
</dialog>