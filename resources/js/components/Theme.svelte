<script lang="ts">
    import { toggleMode } from "mode-watcher";
    import { Moon, Sun } from "@lucide/svelte";
    import { Button } from "@/components/ui/button";
</script>

<Button onclick={toggleMode} variant="link" class="cursor-pointer">
    <Sun
        size={16}
        class="scale-100 rotate-0 !transition-all dark:scale-0 dark:-rotate-90"
    />
    <Moon
        size={16}
        class="absolute scale-0 rotate-90 !transition-all dark:scale-100 dark:rotate-0"
    />
</Button>
