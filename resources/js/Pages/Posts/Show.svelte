<script context="module">
    export { default as layout } from "../Layouts/App.svelte";
</script>

<script>
    import { page, Link, useForm } from "@inertiajs/svelte";

    import Fa from "svelte-fa";
    import { faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";

    export let post;
    let dialog;
    let form = useForm();

    function destroy() {
        dialog.showModal();
    }

    function submit() {
        $form.delete(`/posts/${post.id}`);
    }
</script>

<svelte:head>
    <title>{post.title}</title>
</svelte:head>

<article>
    <div class="flex justify-between items-center border-b pb-3 mb-3">
        <div class="title font-bold">{post.title}</div>

        {#if $page.props.auth.user}
            <div class="inline-flex items-center gap-3">
                <Link href="/posts/{post.id}/edit" title="Edit Post"
                    ><Fa icon={faPencil} /></Link
                >
                <button title="Delete Post" on:click={() => destroy()}
                    ><Fa icon={faTrash} /></button
                >
            </div>
        {/if}
    </div>

    <div class="content prose max-w-none mb-3">
        {@html post.content_to_html}
    </div>
</article>

<dialog
    bind:this={dialog}
    class="w-full md:w-1/3 border border-zinc-100 dark:border-zinc-800 rounded-lg shadow dark:bg-zinc-900 dark:text-white/90 bg-zinc-50 backdrop:backdrop-blur"
>
    <form on:submit|preventDefault={submit}>
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
