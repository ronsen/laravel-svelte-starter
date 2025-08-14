<script lang="ts">
	import { page, Link } from "@inertiajs/svelte";
	import { Pencil } from "@lucide/svelte";
	import App from "../Layouts/App.svelte";
	import Alert from "../Components/Alert.svelte";
	import Delete from "../Components/Delete.svelte";
	import Pagination from "../Components/Pagination.svelte";
	import type { Post } from "../types";

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
	<title>{$page.props.name}</title>
</svelte:head>

<App>
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

				{#if $page.props.auth}
					<div class="inline-flex items-center gap-3">
						<Link href="/posts/{post.id}/edit" title="Edit Post"
							><Pencil size={16} /></Link
						>
						<Delete {post} />
					</div>
				{/if}
			</div>
		{/each}

		<Pagination data={posts} />
	{/if}
</App>
