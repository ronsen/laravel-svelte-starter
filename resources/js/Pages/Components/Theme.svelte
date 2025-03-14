<script>
	import { onMount } from "svelte";
	import { SunMoon } from "lucide-svelte";

	onMount(() => {
		document.documentElement.classList.toggle(
			"dark",
			localStorage.theme === "dark" ||
				(!("theme" in localStorage) &&
					window.matchMedia("(prefers-color-scheme: dark)").matches),
		);
	});

	function toggleMode() {
		if (document.documentElement.classList.contains("dark")) {
			document.documentElement.classList.remove("dark");
			localStorage.removeItem("theme");
		} else {
			document.documentElement.classList.add("dark");
			localStorage.theme = "dark";
		}
	}
</script>

<button onclick={toggleMode} class="cursor-pointer"
	><SunMoon size={16} /></button
>
