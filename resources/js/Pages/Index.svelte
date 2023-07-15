<script>
    import Layout from "./Layout.svelte";

    export let user;
</script>

<svelte:head>
    <title>Welcome</title>
</svelte:head>

<Layout>
    <h1>Hello, {user}!</h1>
</Layout>