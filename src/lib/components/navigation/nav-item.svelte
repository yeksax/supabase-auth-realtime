<script lang="ts">
	import { page } from '$app/stores';
	import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import { twMerge } from 'tailwind-merge';
	import { minifiedSidebar } from '$lib/stores';

	export let name: string;
	export let href: string;
	export let icon: IconDefinition;

	$: pathname = $page.url.pathname;
	$: isCurrentPage = pathname === '/' ? pathname === href : href.startsWith(pathname);
</script>

<a
	{href}
	class="w-full font-medium flex items-center transition-all dark:hover:bg-zinc-800 hover:bg-zinc-50 gap-4 rounded-md {$minifiedSidebar
		? 'px-1.5'
		: 'px-4'} py-1.5 hover:text-zinc-700 text-zinc-500 dark:text-zinc-300 dark:hover:text-zinc-50 {isCurrentPage
		? 'text-zinc-700 dark:text-zinc-50 dark:bg-zinc-800 bg-zinc-100 font-semibold hover:bg-zinc-100'
		: 'opacity-60'}">
	<span class="w-4 grid place-items-center">
		<Fa {icon} />
	</span>
	{#if !$minifiedSidebar}
		{name}
	{/if}
</a>
