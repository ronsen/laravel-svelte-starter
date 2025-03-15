<script module>
	export { default as layout } from "../Layouts/App.svelte";
</script>

<script>
	import { useForm } from "@inertiajs/svelte";

	let form = useForm({
		title: null,
		content: null,
	});

	function submit(e) {
		e.preventDefault();
		$form.post("/posts");
	}
</script>

<svelte:head>
	<title>Add New Post</title>
</svelte:head>

<form onsubmit={submit}>
	<div class="mb-3">
		<input
			type="text"
			bind:value={$form.title}
			placeholder="Title"
			class="rounded-lg dark:bg-zinc-800 w-full"
		/>
		{#if $form.errors.title}
			<div class="text-red-500 text-sm font-bold mt-1">
				{$form.errors.title}
			</div>
		{/if}
	</div>
	<div class="mb-3">
		<textarea
			bind:value={$form.content}
			rows="5"
			placeholder="Content"
			class="rounded-lg dark:bg-zinc-800 w-full"
		></textarea>
	</div>
	<button
		type="submit"
		class="p-2 border border-zinc-500 rounded-lg text-sm cursor-pointer"
		disabled={$form.processing}>Save</button
	>
</form>
