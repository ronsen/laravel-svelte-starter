<script>
    let show = true;

    function close() {
        show = !show;
    }
</script>

{#if show}
    <div class="alert alert-warning shadow-lg mb-6">
        <div>
            <i class="bi bi-info-circle"></i>
        
            <slot />
        </div>
        <span></span>
        <button on:click|preventDefault={close}><i class="bi bi-x-circle"></i></button>
    </div>
{/if}