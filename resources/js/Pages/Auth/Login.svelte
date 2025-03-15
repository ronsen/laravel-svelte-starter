<script module>
	export { default as layout } from "../Layouts/App.svelte";
</script>

<script>
	import { useForm } from "@inertiajs/svelte";

	let form = useForm({
		email: "",
		password: "",
	});

	function submit(e) {
		e.preventDefault();
		$form.post("/login", {
			onSubmit: () => $form.reset("password"),
		});
	}
</script>

<svelte:head>
	<title>Log In</title>
</svelte:head>

<form onsubmit={submit}>
	<div class="mb-3">
		<input
			type="email"
			bind:value={$form.email}
			placeholder="E-mail"
			class="rounded-lg dark:bg-zinc-800 w-full"
		/>
		{#if $form.errors.email}
			<div class="text-red-500 text-sm mt-1">{$form.errors.email}</div>
		{/if}
	</div>
	<div class="mb-3">
		<input
			type="password"
			bind:value={$form.password}
			placeholder="Password"
			class="rounded-lg dark:bg-zinc-800 w-full"
		/>
		{#if $form.errors.password}
			<div class="text-red-500 text-sm mt-1">{$form.errors.password}</div>
		{/if}
	</div>
	<button
		type="submit"
		class="p-2 border border-zinc-500 rounded-lg text-sm cursor-pointer"
		disabled={$form.processing}>Log In</button
	>
</form>
