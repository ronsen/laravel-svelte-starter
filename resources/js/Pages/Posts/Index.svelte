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
        <div
            class="flex justify-between items-center border-b dark:border-zinc-700 pb-2 mb-2"
        >
            <div class="note-title">
                <Link href="/posts/{post.id}">{post.title}</Link>
            </div>

            {#if $page.props.auth.user}
                <div class="inline-flex items-center gap-3">
                    <Link href="/posts/{post.id}/edit" title="Edit Post"
                        ><Fa icon={faPencil} /></Link
                    >
                    <button title="Delete Post" on:click={() => destroy(post)}
                        ><Fa icon={faTrash} /></button
                    >
                </div>
            {/if}
        </div>
    {/each}

    <Pagination data={posts} />
{/if}

<dialog
    bind:this={dialog}
    class="w-full md:w-1/3 border border-zinc-100 dark:border-zinc-800 rounded-lg shadow dark:bg-zinc-900 dark:text-white/90 bg-zinc-50 backdrop:backdrop-blur"
>
    <form on:submit|preventDefault={submit}>
        <input type="hidden" bind:this={post} />
        <div class="p-4">
            <h3 class="font-bold mb-3">Confirm</h3>
            <p>Delete this post?</p>
        </div>

        <div class="p-4 bg-zinc-100 dark:bg-zinc-800">
            <div class="flex justify-between gap-4">
                <button
                    class="p-2 border border-zinc-500 rounded-lg text-sm"
                    on:click|preventDefault={() => dialog.close()}>No</button
                >
                <button
                    type="submit"
                    class="p-2 border border-zinc-500 rounded-lg text-sm"
                    >Yes</button
                >
            </div>
        </div>
    </form>
</dialog>
