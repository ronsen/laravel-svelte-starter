<script context="module">
    export { default as layout } from "../Layouts/App.svelte";
</script>

<script>
    import { page, Link, useForm } from "@inertiajs/svelte";
    import Alert from "../Components/Alert.svelte";
    import Pagination from "../Components/Pagination.svelte";

	import Fa from "svelte-fa";
    import { faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";

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

{#if posts.data.length == 0}
    <Alert>Empty.</Alert>
{:else}
    {#each posts.data as post}
        <div class="flex justify-between items-center border-b border-base-300 pb-2 mb-2">
            <div class="note-title">
                <Link href="/posts/{post.id}">{post.title}</Link>
            </div>

            {#if $page.props.auth.user}
                <div class="inline-flex items-center gap-3">
                    <Link href="/posts/{post.id}/edit" title="Edit Post" class="text-gray-500"><Fa icon={faPencil} /></Link>
                    <button title="Delete Post" class="text-gray-500" on:click={() => destroy(post)}><Fa icon={faTrash} /></button>
                </div>
            {/if}
        </div>
    {/each}

    <Pagination data={posts} />
{/if}

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