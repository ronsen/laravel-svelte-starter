<script>
	import { router } from "@inertiajs/svelte";
	import { Trash } from "lucide-svelte";

	let { post } = $props();

	let dialog;

	function destroy() {
		dialog.showModal();
	}

	function close(e) {
		e.preventDefault();
		dialog.close();
	}

	function submit(e) {
		e.preventDefault();
		router.delete(`/posts/${post.id}`);
		dialog.close();
	}
</script>

<button type="button" class="cursor-pointer" onclick={destroy}
	><Trash size={16} /></button
>

<dialog
	bind:this={dialog}
	class="w-full mx-auto my-auto -translate-x-0.5 md:w-1/3 border border-zinc-100 dark:border-zinc-600 rounded-lg shadow dark:bg-zinc-900 dark:text-white/90 bg-zinc-50 backdrop:backdrop-blur"
>
	<form onsubmit={submit}>
		<div class="p-6">
			<p>Delete this post?</p>
		</div>

		<div class="flex justify-end gap-3 p-3 bg-zinc-100 dark:bg-zinc-800">
			<div class="flex justify-between gap-4">
				<button
					class="p-2 border border-zinc-500 rounded-lg text-sm cursor-pointer"
					onclick={close}>No</button
				>
				<button
					type="submit"
					class="p-2 border border-red-500 bg-red-500 rounded-lg text-sm cursor-pointer"
					>Yes</button
				>
			</div>
		</div>
	</form>
</dialog>
