<script module>
	export { default as layout } from "../Layouts/App.svelte";
</script>

<script>
	import { page, Link } from "@inertiajs/svelte";
	import { Pencil } from "lucide-svelte";
	import Alert from "../Components/Alert.svelte";
	import Delete from "../Components/Delete.svelte";
	import Pagination from "../Components/Pagination.svelte";

	let { posts } = $props();
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
						><Pencil size={16} /></Link
					>
					<Delete {post} />
				</div>
			{/if}
		</div>
	{/each}

	<Pagination data={posts} />
{/if}
