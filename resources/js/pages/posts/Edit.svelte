<script lang="ts">
    import { Form } from "@inertiajs/svelte";
    import App from "@/layouts/App.svelte";
    import type { Post } from "@/types";

    let { post }: { post: Post } = $props();
</script>

<svelte:head>
    <title>Edit Post</title>
</svelte:head>

<App>
    <Form action="/posts/{post.id}" method="patch" disableWhileProcessing>
        {#snippet children({ errors, processing })}
            <div class="mb-3">
                <input
                    type="text"
                    name="title"
                    value={post.title}
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
                    rows="10"
                    placeholder="Content"
                    class="rounded-lg dark:bg-zinc-800 w-full"
                    >{post.content}</textarea
                >
            </div>
            <button
                type="submit"
                class="p-2 border border-zinc-500 rounded-lg text-sm cursor-pointer w-full"
                disabled={processing}>Update</button
            >
        {/snippet}
    </Form>
</App>
