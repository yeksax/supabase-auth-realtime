<script lang="ts">
	import { page } from '$app/stores';
	import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import { twMerge } from 'tailwind-merge';

	export let name: string;
	export let href: string;
	export let icon: IconDefinition;

	$: pathname = $page.url.pathname;
	$: isCurrentPage = pathname === '/' ? pathname === href : href.startsWith(pathname);
	let className = 'text-zinc-700 bg-zinc-100 font-semibold hover:bg-zinc-100';
</script>

<a
	{href}
	class={twMerge(
		'w-full font-medium flex items-center transition-all hover:bg-zinc-50 gap-4 rounded-md px-4 py-1.5 hover:text-zinc-700 text-zinc-500',
		isCurrentPage ? className : '',
	)}
>
	<span class="w-4 grid place-items-center">
		<Fa {icon} />
	</span>
	{name}
</a>
