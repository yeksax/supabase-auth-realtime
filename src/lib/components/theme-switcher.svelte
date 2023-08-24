<script lang="ts">
	import { browser } from '$app/environment';
	import { theme } from '$lib/stores';
	import { MoonIcon, SunIcon } from 'svelte-feather-icons';
	import { minifiedSidebar } from '$lib/stores';

	function switchTheme() {
		theme.update((t) => (t == 'LIGHT' ? 'DARK' : 'LIGHT'));
	}

	if (browser) {
		$theme = localStorage.getItem('theme') as 'LIGHT' | 'DARK';
	}

	$: {
		if (browser) {
			if ($theme === 'DARK') {
				document.body.classList.add('dark');
			} else {
				document.body.classList.remove('dark');
			}

			localStorage.setItem('theme', $theme);
		}
	}
</script>

<button
	on:click={switchTheme}
	class="w-full justify-between font-medium flex items-center transition-all dark:hover:bg-zinc-800 hover:bg-zinc-50 gap-4 rounded-md {$minifiedSidebar
		? 'px-1.5'
		: 'px-4'} py-1.5 hover:text-zinc-700 text-zinc-700 dark:text-zinc-300 dark:hover:text-zinc-50">
	<div class="flex gap-4 items-center">
		{#if $theme === 'LIGHT'}
			<SunIcon size="14" />
		{:else}
			<MoonIcon size="14" />
		{/if}
		{#if !$minifiedSidebar}
			Tema
		{/if}
	</div>
	{#if !$minifiedSidebar}
		<div class="rounded-full w-6 h-3 p-0.5 relative border dark:border-zinc-300 box-content">
			<div
				class="rounded-full w-3 h-3 bg-zinc-400 dark:bg-zinc-300 absolute transition-all {$theme ==
				'DARK'
					? 'translate-x-full'
					: ''}" />
		</div>
	{/if}
</button>
