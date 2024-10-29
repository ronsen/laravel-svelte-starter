<script>
    import Fa from "svelte-fa";
    import { faCircleInfo, faXmark } from "@fortawesome/free-solid-svg-icons";

    let show = true;

    function close() {
        show = !show;
    }
</script>

{#if show}
    <div
        class="flex justify-between items-center gap-3 border p-3 rounded-lg shadow mb-6"
    >
        <div class="inline-flex items-center gap-1">
            <Fa icon={faCircleInfo} />

            <slot />
        </div>
        <span></span>
        <button on:click|preventDefault={close}><Fa icon={faXmark} /></button>
    </div>
{/if}
