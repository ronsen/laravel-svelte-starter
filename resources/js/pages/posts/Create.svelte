<script lang="ts">
    import { Form } from "@inertiajs/svelte";
    import App from "@/layouts/App.svelte";
    import { Input } from "@/components/ui/input";
    import { Textarea } from "@/components/ui/textarea";
    import { Button } from "@/components/ui/button";
</script>

<svelte:head>
    <title>Add New Post</title>
</svelte:head>

<App>
    <Form action="/posts" method="post" disableWhileProcessing>
        {#snippet children({ errors, processing })}
            <div class="mb-3">
                <Input type="text" name="title" placeholder="Title" />
                {#if errors.title}
                    <div class="text-red-500 text-sm mt-1">
                        {errors.title}
                    </div>
                {/if}
            </div>
            <div class="mb-3">
                <Textarea
                    name="content"
                    rows={5}
                    placeholder="Content"
                    class="rounded-lg dark:bg-zinc-800 w-full"
                />
            </div>
            <Button type="submit" class="w-full" disabled={processing}
                >Save</Button
            >
        {/snippet}
    </Form>
</App>
