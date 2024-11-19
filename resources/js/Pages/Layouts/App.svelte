<script>
    import { page, Link, inertia } from "@inertiajs/svelte";
    import Alert from "../Components/Alert.svelte";

    import Fa from "svelte-fa";
    import {
        faPlus,
        faRightFromBracket,
        faRightToBracket,
        faCircleHalfStroke,
    } from "@fortawesome/free-solid-svg-icons";

    function toggleMode() {
        const theme = localStorage.getItem("theme") ?? "light";

        if (theme == "light") {
            document.documentElement.classList.remove("light");
            document.documentElement.classList.add("dark");

            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            document.documentElement.classList.add("light");

            localStorage.setItem("theme", "light");
        }
    }

    let { children } = $props();
</script>

<main class="container mx-auto md:w-[720px] my-6 px-6 md:my-12">
    <nav
        class="flex justify-between items-center border-b dark:border-zinc-700 pb-2 mb-8"
    >
        <h1 class="font-bold">
            <Link href="/">{$page.props.appName}</Link>
        </h1>

        <div class="inline-flex gap-3">
            <button onclick={toggleMode}
                ><Fa icon={faCircleHalfStroke} /></button
            >

            {#if $page.props.auth.user}
                <Link href="/posts/create"><Fa icon={faPlus} /></Link>
                <button use:inertia={{ href: "/logout", method: "post" }}
                    ><Fa icon={faRightFromBracket} /></button
                >
            {/if}

            {#if !$page.props.auth.user}
                <Link href="/login"><Fa icon={faRightToBracket} /></Link>
            {/if}
        </div>
    </nav>

    {#if $page.props.flash.message}
        <Alert>{@html $page.props.flash.message}</Alert>
    {/if}

    {@render children()}
</main>
