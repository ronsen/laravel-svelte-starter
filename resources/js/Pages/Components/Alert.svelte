<script>
	import { CircleAlert, X } from "lucide-svelte";

	let { children } = $props();

	let show = $state(true);

	function close(e) {
		e.preventDefault();
		show = !show;
	}
</script>

{#if show}
	<div
		class="flex justify-between items-center gap-3 border p-3 rounded-lg shadow mb-6"
	>
		<div class="inline-flex items-center gap-3">
			<CircleAlert size={16} />
			<div>
				{@render children()}
			</div>
		</div>
		<span></span>
		<button onclick={close} class="cursor-pointer"><X size={16} /></button>
	</div>
{/if}
