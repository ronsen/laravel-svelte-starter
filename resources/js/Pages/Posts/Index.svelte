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
        <div class="flex justify-between items-center border-b dark:border-zinc-700 pb-2 mb-2">
            <div class="note-title">
                <Link href="/posts/{post.id}">{post.title}</Link>
            </div>

            {#if $page.props.auth.user}
                <div class="inline-flex items-center gap-3">
                    <Link
                        href="/posts/{post.id}/edit"
                        title="Edit Post"
                        class="text-zinc-500"><Fa icon={faPencil} /></Link
                    >
                    <button
                        title="Delete Post"
                        class="text-zinc-500"
                        on:click={() => destroy(post)}
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
    class="w-full md:w-1/2 p-6 rounded-lg shadow text-black/90 dark:bg-zinc-800 dark:text-white/90"
>
    <form on:submit|preventDefault={submit}>
        <input type="hidden" bind:this={post} />
        <h3 class="font-bold">Confirm</h3>
        <p class="py-4">Delete this post?</p>

        <div class="inline-flex gap-2">
            <button
                class="p-2 border rounded-lg text-sm shadow-sm hover:bg-zinc-100 dark:hover:bg-zinc-700"
                on:click|preventDefault={() => dialog.close()}>No</button
            >
            <button
                type="submit"
                class="p-2 border border-red-500 bg-red-500 rounded-lg text-sm shadow-sm hover:bg-red-600 text-white/90"
                >Yes</button
            >
        </div>
    </form>
</dialog>
