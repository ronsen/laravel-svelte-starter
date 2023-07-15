<script>
    import { Link } from "@inertiajs/svelte";
    
    export let data;
</script>

<div class="text-center mt-6">
    <div class="join gap-3">
        {#if data.prev_page_url}
            <Link href={data.prev_page_url} class="join-item"><i class="bi bi-arrow-left"></i></Link>
        {:else}
            <button class="btn-disabled"><i class="bi bi-arrow-left"></i></button>
        {/if}

        {#if data.next_page_url}
            <Link href={data.next_page_url} class="join-item"><i class="bi bi-arrow-right"></i></Link>
        {:else}
            <button class="btn-disabled"><i class="bi bi-arrow-right"></i></button>
        {/if}
    </div>
</div>