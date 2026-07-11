<script lang="ts">
    import { Form } from "@inertiajs/svelte";
    import App from "@/layouts/App.svelte";
    import * as Field from "@/components/ui/field";
    import { Input } from "@/components/ui/input";
    import { Button } from "@/components/ui/button";
</script>

<svelte:head>
    <title>Log In</title>
</svelte:head>

<App>
    <Form action="/login" method="post" disableWhileProcessing>
        {#snippet children({ errors, processing })}
            <Field.Group>
                <Field.Set>
                    <Field.Field>
                        <Input type="email" name="email" placeholder="E-mail" />
                        {#if errors.email}
                            <Field.Error>
                                {errors.email}
                            </Field.Error>
                        {/if}
                    </Field.Field>
                    <Field.Field>
                        <Input
                            type="password"
                            name="password"
                            placeholder="Password"
                        />
                        {#if errors.password}
                            <Field.Error>
                                {errors.password}
                            </Field.Error>
                        {/if}
                    </Field.Field>
                </Field.Set>
                <Button type="submit" disabled={processing}>Log In</Button>
            </Field.Group>
        {/snippet}
    </Form>
</App>
