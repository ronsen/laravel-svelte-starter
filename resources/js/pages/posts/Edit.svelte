<script lang="ts">
    import { Form } from "@inertiajs/svelte";
    import App from "@/layouts/App.svelte";
    import type { Post } from "@/types";
    import * as Field from "@/components/ui/field";
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
            <Field.Group>
                <Field.Set>
                    <Field.Field>
                        <Input
                            type="text"
                            name="title"
                            value={post.title}
                            placeholder="Title"
                        />
                        {#if errors.title}
                            <Field.Error>
                                {errors.title}
                            </Field.Error>
                        {/if}
                    </Field.Field>
                    <Field.Field>
                        <Textarea
                            name="content"
                            rows={10}
                            placeholder="Content"
                            value={post.content}
                        />
                    </Field.Field>
                </Field.Set>
                <Button type="submit" disabled={processing}>Update</Button>
            </Field.Group>
        {/snippet}
    </Form>
</App>
