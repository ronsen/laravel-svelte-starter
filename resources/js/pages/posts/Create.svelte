<script lang="ts">
    import { Form } from "@inertiajs/svelte";
    import App from "@/layouts/App.svelte";
    import * as Field from "@/components/ui/field";
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
            <Field.Group>
                <Field.Set>
                    <Field.Field>
                        <Input type="text" name="title" placeholder="Title" />
                        {#if errors.title}
                            <Field.Error>
                                {errors.title}
                            </Field.Error>
                        {/if}
                    </Field.Field>
                    <Field.Field>
                        <Textarea
                            name="content"
                            placeholder="Content"
                        />
                    </Field.Field>
                </Field.Set>
                <Button type="submit" disabled={processing}>Save</Button>
            </Field.Group>
        {/snippet}
    </Form>
</App>
