<script>
    import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
    import { Link } from "@inertiajs/svelte";
	
	import Fa from "svelte-fa";
    
    export let data;
</script>

<div class="text-center mt-6">
    <div class="join gap-4">
        {#if data.prev_page_url}
            <Link href={data.prev_page_url} class="join-item hover:font-bold text-lg"><Fa icon={faArrowLeft} /></Link>
        {:else}
            <button class="btn-disabled"><Fa icon={faArrowLeft} /></button>
        {/if}

        {#if data.next_page_url}
            <Link href={data.next_page_url} class="join-item hover:font-bold text-lg"><Fa icon={faArrowRight} /></Link>
        {:else}
            <button class="btn-disabled"><Fa icon={faArrowRight} /></button>
        {/if}
    </div>
</div>