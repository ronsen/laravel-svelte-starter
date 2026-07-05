<script lang="ts">
    import { Form } from "@inertiajs/svelte";
    import { Trash } from "@lucide/svelte";
    import type { Post } from "@/types";
    import * as Dialog from "@/components/ui/dialog";
    import { Button, buttonVariants } from "@/components/ui/button";

    let { post }: { post: Post } = $props();
</script>

<Dialog.Root>
    <Dialog.Trigger class="cursor-pointer"><Trash size={16} /></Dialog.Trigger>
    <Dialog.Content>
        <Dialog.Header>
            <Dialog.Title>Delete</Dialog.Title>
            <Dialog.Description
                ><p>
                    Are you sure want to delete this post?
                </p></Dialog.Description
            >
        </Dialog.Header>
        <Dialog.Footer>
            <Form
                method="DELETE"
                action={post.delete_url}
                disableWhileProcessing
            >
                <Dialog.Close class={buttonVariants({ variant: "secondary" })}
                    >No</Dialog.Close
                >
                <Button type="submit" variant="destructive">Delete</Button>
            </Form>
        </Dialog.Footer>
    </Dialog.Content>
</Dialog.Root>
