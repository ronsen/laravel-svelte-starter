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
		const theme = localStorage.getItem("theme") ?? "light";

		if (theme == "light") {
			document.documentElement.classList.remove("light");
			document.documentElement.classList.add("dark");

			localStorage.setItem("theme", "dark");
		} else {
			document.documentElement.classList.remove("dark");
			document.documentElement.classList.add("light");

			localStorage.setItem("theme", "light");
		}
	}
</script>

<button onclick={toggleMode} class="cursor-pointer"
	><SunMoon size={16} /></button
>
