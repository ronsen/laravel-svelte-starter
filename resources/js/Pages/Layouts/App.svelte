<script>
    import { page, Link } from "@inertiajs/svelte";
    import { router } from '@inertiajs/svelte';
    import Alert from "../Components/Alert.svelte";

	import Fa from "svelte-fa";
	import { faCirclePlus, faRightFromBracket, faRightToBracket } from "@fortawesome/free-solid-svg-icons";

    function logout() {
        router.post('/logout');
    }
</script>

<main class="container mx-auto md:w-[720px] my-6 px-6 md:my-12">
    <nav class="flex justify-between items-center border-b border-primary pb-2 mb-8">
        <h1 class="font-bold uppercase"><Link href="/">{$page.props.appName}</Link></h1>

        <div class="inline-flex gap-3">
            {#if $page.props.auth.user}
                <Link href="/posts/create"><Fa icon={faCirclePlus} /></Link>
                <button on:click|preventDefault={logout}><Fa icon={faRightFromBracket} /></button>
            {/if}
            
            {#if ! $page.props.auth.user}
                <Link href="/login"><Fa icon={faRightToBracket} /></Link>
            {/if}
        </div>
    </nav>

    {#if $page.props.flash.message}
        <Alert>{@html $page.props.flash.message}</Alert>
    {/if}

    <slot />
</main>