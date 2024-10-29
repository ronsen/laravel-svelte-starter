<script>
    import {
        faArrowLeft,
        faArrowRight,
    } from "@fortawesome/free-solid-svg-icons";
    import { Link } from "@inertiajs/svelte";

    import Fa from "svelte-fa";

    export let data;
</script>

<div class="text-center mt-6">
    <div class="flex justify-between items-center gap-4">
        {#if data.prev_page_url}
            <Link href={data.prev_page_url} class="hover:font-bold"
                ><Fa icon={faArrowLeft} /></Link
            >
        {:else}
            <button class="cursor-default text-zinc-500"
                ><Fa icon={faArrowLeft} /></button
            >
        {/if}

        {#if data.next_page_url}
            <Link href={data.next_page_url} class="hover:font-bold"
                ><Fa icon={faArrowRight} /></Link
            >
        {:else}
            <button class="cursor-default text-zinc-500"
                ><Fa icon={faArrowRight} /></button
            >
        {/if}
    </div>
</div>
