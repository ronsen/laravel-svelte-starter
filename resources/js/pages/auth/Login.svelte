<script lang="ts">
    import { Form } from "@inertiajs/svelte";
    import App from "@/layouts/App.svelte";
    import { Input } from "@/components/ui/input";
    import { Button } from "@/components/ui/button";
</script>

<svelte:head>
    <title>Log In</title>
</svelte:head>

<App>
    <Form action="/login" method="post">
        {#snippet children({ errors, processing })}
            <div class="mb-3">
                <Input type="email" name="email" placeholder="E-mail" />
                {#if errors.email}
                    <div class="text-red-500 text-sm mt-1">
                        {errors.email}
                    </div>
                {/if}
            </div>
            <div class="mb-3">
                <Input type="password" name="password" placeholder="Password" />
                {#if errors.password}
                    <div class="text-red-500 text-sm mt-1">
                        {errors.password}
                    </div>
                {/if}
            </div>
            <Button type="submit" class="w-full" disabled={processing}>Log In</Button>
        {/snippet}
    </Form>
</App>
