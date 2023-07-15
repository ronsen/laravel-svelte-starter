<script>
    import { inertia } from "@inertiajs/svelte";
    
    export let data;
</script>

<div class="text-center mt-6">
    <div class="join gap-3">
        {#if data.prev_page_url}
            <a use:inertia href={data.prev_page_url} class="btn btn-secondary join-item"><i class="bi bi-arrow-left"></i></a>
        {:else}
            <button class="btn btn-secondary btn-disabled"><i class="bi bi-arrow-left"></i></button>
        {/if}

        {#if data.next_page_url}
            <a use:inertia href={data.next_page_url} class="btn btn-secondary join-item"><i class="bi bi-arrow-right"></i></a>
        {:else}
            <button class="btn btn-secondary btn-disabled"><i class="bi bi-arrow-right"></i></button>
        {/if}
    </div>
</div>