<script>
	import { Link } from "@inertiajs/svelte";
	import { MoveLeft, MoveRight } from "lucide-svelte";

	let { data } = $props();
</script>

<div class="text-center mt-6">
	<div class="flex justify-between items-center gap-4">
		{#if data.prev_page_url}
			<Link href={data.prev_page_url}><MoveLeft size={16} /></Link>
		{:else}
			<button class="cursor-default"><MoveLeft size={16} /></button>
		{/if}

		{#if data.next_page_url}
			<Link href={data.next_page_url}><MoveRight size={16} /></Link>
		{:else}
			<button class="cursor-default"><MoveRight size={16} /></button>
		{/if}
	</div>
</div>
