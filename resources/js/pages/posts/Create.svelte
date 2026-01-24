<script lang="ts">
    import { Form } from "@inertiajs/svelte";
    import App from "@/layouts/App.svelte";
</script>

<svelte:head>
    <title>Add New Post</title>
</svelte:head>

<App>
    <Form action="/posts" method="post" disableWhileProcessing>
        {#snippet children(
            { errors }: { errors: Record<string, string> },
            processing: boolean,
        )}
            <div class="mb-3">
                <input
                    type="text"
                    name="title"
                    placeholder="Title"
                    class="rounded-lg dark:bg-zinc-800 w-full"
                />
                {#if errors.title}
                    <div class="text-red-500 text-sm mt-1">
                        {errors.title}
                    </div>
                {/if}
            </div>
            <div class="mb-3">
                <textarea
                    name="content"
                    rows="5"
                    placeholder="Content"
                    class="rounded-lg dark:bg-zinc-800 w-full"
                ></textarea>
            </div>
            <button
                type="submit"
                class="p-2 border border-zinc-500 rounded-lg text-sm cursor-pointer w-full"
                >Save</button
            >
        {/snippet}
    </Form>
</App>
