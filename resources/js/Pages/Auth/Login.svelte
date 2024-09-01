<script context="module">
    export { default as layout } from "../Layouts/App.svelte";
</script>

<script>
    import { useForm } from "@inertiajs/svelte";

    let form = useForm({
        email: '',
        password: ''
    });

    function submit() {
        $form.post('/login', {
            onSubmit: () => $form.reset('password'),
        });
    }
</script>

<svelte:head>
    <title>Log In</title>
</svelte:head>

<form on:submit|preventDefault={submit}>
	<div class="mb-3">
		<input type="email" bind:value={$form.email} placeholder="E-mail" class="input input-bordered w-full">
		{#if $form.errors.email}
			<div class="text-error text-sm font-bold mt-1">{$form.errors.email}</div>
		{/if}
	</div>
	<div class="mb-3">
		<input type="password" bind:value={$form.password} placeholder="Password" class="input input-bordered w-full">
		{#if $form.errors.password}
			<div class="text-error text-sm font-bold mt-1">{$form.errors.password}</div>
		{/if}
	</div>
	<button type="submit" class="btn btn-primary" disabled={$form.processing}>Log In</button>
</form>