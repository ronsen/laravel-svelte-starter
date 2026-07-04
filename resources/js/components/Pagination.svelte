<script lang="ts">
    import { Link } from "@inertiajs/svelte";
    import { MoveLeft, MoveRight } from "@lucide/svelte";
    import { Button, buttonVariants } from "@/components/ui/button";

    interface Props {
        data: {
            prev_page_url?: string;
            next_page_url?: string;
        };
    }

    let { data }: Props = $props();
</script>

<div class="text-center mt-6">
    <div class="flex justify-between items-center gap-4">
        {#if data.prev_page_url}
            <Link
                href={data.prev_page_url}
                class={buttonVariants({ variant: "outline" })}
                ><MoveLeft size={16} /></Link
            >
        {:else}
            <Button disabled><MoveLeft size={16} /></Button>
        {/if}

        {#if data.next_page_url}
            <Link
                href={data.next_page_url}
                class={buttonVariants({ variant: "outline" })}
                ><MoveRight size={16} /></Link
            >
        {:else}
            <Button disabled><MoveRight size={16} /></Button>
        {/if}
    </div>
</div>
