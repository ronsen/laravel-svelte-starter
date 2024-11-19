<script>
    import Fa from "svelte-fa";
    import { faCircleInfo, faXmark } from "@fortawesome/free-solid-svg-icons";

    let { children } = $props();

    let show = $state(true);

    function close(e) {
        e.preventDefault();
        show = !show;
    }
</script>

{#if show}
    <div
        class="flex justify-between items-center gap-3 border p-3 rounded-lg shadow mb-6"
    >
        <div class="inline-flex items-center gap-3">
            <Fa icon={faCircleInfo} />
            <div>
                {@render children()}
            </div>
        </div>
        <span></span>
        <button onclick={close}><Fa icon={faXmark} /></button>
    </div>
{/if}
