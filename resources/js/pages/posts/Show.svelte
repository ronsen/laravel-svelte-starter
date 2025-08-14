<script lang="ts">
    import { page, Link } from "@inertiajs/svelte";
    import { Pencil } from "@lucide/svelte";
    import Delete from "../components/Delete.svelte";
    import App from "../layouts/App.svelte";
    import type { Post } from "../types";

    interface Props {
        post: Post;
    }

    let { post }: Props = $props();
</script>

<svelte:head>
    <title>{post.title}</title>
</svelte:head>

<App>
    <article>
        <div class="flex justify-between items-center border-b pb-3 mb-3">
            <div class="title font-bold">{post.title}</div>

            {#if $page.props.auth}
                <div class="inline-flex items-center gap-3">
                    <Link href="/posts/{post.id}/edit" title="Edit Post"
                        ><Pencil size={16} /></Link
                    >
                    <Delete {post} />
                </div>
            {/if}
        </div>

        <div class="content prose max-w-none mb-3">
            {@html post.content_to_html}
        </div>
    </article>
</App>
