<script lang="ts">
    import { router } from "@inertiajs/svelte";
    import { Trash } from "@lucide/svelte";
    import type { Post } from "@/types";
    import * as AlertDialog from "@/components/ui/alert-dialog";

    let { post }: { post: Post } = $props();

    function confirmDelete() {
        router.delete(`${post.delete_url}`);
    }
</script>

<AlertDialog.Root>
    <AlertDialog.Trigger class="cursor-pointer"
        ><Trash size={16} /></AlertDialog.Trigger
    >
    <AlertDialog.Content>
        <AlertDialog.Header>
            <AlertDialog.Title>Delete</AlertDialog.Title>
            <AlertDialog.Description>
                Are you sure want to delete this post?
            </AlertDialog.Description>
        </AlertDialog.Header>
        <AlertDialog.Footer
            ><AlertDialog.Cancel>No</AlertDialog.Cancel>
            <AlertDialog.Action onclick={confirmDelete} variant="destructive"
                >Delete</AlertDialog.Action
            >
        </AlertDialog.Footer>
    </AlertDialog.Content>
</AlertDialog.Root>
