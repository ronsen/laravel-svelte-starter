<script module>
    export { default as layout } from "../Layouts/App.svelte";
</script>

<script>
    import { page, Link, useForm } from "@inertiajs/svelte";
	import Delete from "../Components/Delete.svelte";

    import Fa from "svelte-fa";
    import { faPencil } from "@fortawesome/free-solid-svg-icons";

    let { post } = $props();
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
                <Delete {post} />
            </div>
        {/if}
    </div>

    <div class="content prose max-w-none mb-3">
        {@html post.content_to_html}
    </div>
</article>