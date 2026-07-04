<script lang="ts">
    import { Form } from "@inertiajs/svelte";
    import App from "@/layouts/App.svelte";
    import type { Post } from "@/types";
    import { Input } from "@/components/ui/input";
    import { Button } from "@/components/ui/button";
    import { Textarea } from "@/components/ui/textarea";

    let { post }: { post: Post } = $props();
</script>

<svelte:head>
    <title>Edit Post</title>
</svelte:head>

<App>
    <Form action={post.show_url} method="patch" disableWhileProcessing>
        {#snippet children({ errors, processing })}
            <div class="mb-3">
                <Input
                    type="text"
                    name="title"
                    value={post.title}
                    placeholder="Title"
                />
                {#if errors.title}
                    <div class="text-red-500 text-sm mt-1">
                        {errors.title}
                    </div>
                {/if}
            </div>
            <div class="mb-3">
                <Textarea
                    name="content"
                    rows="10"
                    placeholder="Content"
                    value={post.content}
                />
            </div>
            <Button type="submit" class="w-full" disabled={processing}
                >Update</Button
            >
        {/snippet}
    </Form>
</App>
