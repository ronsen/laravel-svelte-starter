<script lang="ts">
    import { page, Link } from "@inertiajs/svelte";
    import type { Post } from "@/types";
    import App from "@/layouts/App.svelte";
    import Alert from "@/components/Alert.svelte";
    import Pagination from "@/components/Pagination.svelte";

    interface Props {
        posts: {
            data: Post[];
            prev_page_url: string;
            next_page_url: string;
        };
    }

    let { posts }: Props = $props();
</script>

<svelte:head>
    <title>{page.props.name}</title>
</svelte:head>

<App>
    {#if posts.data.length == 0}
        <Alert>Empty.</Alert>
    {:else}
        {#each posts.data as post}
            <div
                class="border-b dark:border-zinc-700 pb-2 mb-2"
            >
                <Link href="/posts/{post.id}">{post.title}</Link>
            </div>
        {/each}

        <Pagination data={posts} />
    {/if}
</App>
