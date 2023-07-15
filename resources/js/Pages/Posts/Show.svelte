<script>
    import { page, Link, useForm } from "@inertiajs/svelte";
    import Layout from "../Layout.svelte";

    export let post;
    let dialog;
    let form = useForm();

    function destroy() {
        dialog.showModal();
    }

    function submit() {
        $form.delete('/posts/' + post.id);
    }
</script>

<svelte:head>
    <title>{post.title}</title>
</svelte:head>

<Layout>
    <article>
        <div class="flex justify-between items-center border-b border-base-300 pb-3 mb-3">
            <div class="title font-bold">{post.title}</div>

            {#if $page.props.auth.user}
                <div class="inline-flex gap-3">
                    <Link href="/posts/{post.id}/edit" title="Edit Post" class="text-gray-500"><i class="bi bi-pencil-square"></i></Link>
                    <button title="Delete Post" class="text-gray-500" on:click={() => destroy()}><i class="bi bi-trash"></i></button>
                </div>
            {/if}
        </div>
    
        <div class="content prose max-w-none mb-3">
            {@html post.contentToHtml}
        </div>
    </article>
</Layout>

<dialog bind:this={dialog} class="w-full md:w-2/5 rounded-lg p-6">
    <form on:submit|preventDefault={submit}>
        Delete this post?

        <div class="flex justify-end gap-3 mt-3">
            <button type="submit" class="btn btn-error btn-sm">Yes</button>
            <button class="btn btn-neutral btn-sm" on:click|preventDefault={() => dialog.close()}>No</button>
        </div>
    </form>
</dialog>