<script lang="ts">
	import { twMerge } from 'tailwind-merge';

	export let label: string = '';
	export let preventPlaceholderMove = false;
	export let value = '';
	export let shortcutHandler = (e: KeyboardEvent) => {};
	export let onInput = (string: string) => {};
</script>

<div class="relative group {$$props.class}">
	<div
		class="absolute {value.length > 0 && !preventPlaceholderMove
			? '-top-1/2 translate-y-1/3'
			: 'pointer-events-none top-1/2 -translate-y-1/2 text-zinc-400'} left-2 font-medium transition-all px-2 bg-white dark:bg-zinc-900 {preventPlaceholderMove &&
		value.length
			? 'opacity-0 duration-0'
			: ''}">
		{label}
	</div>

	<input
		type="text"
		on:input={() => onInput(value)}
		on:keydown={shortcutHandler}
		bind:value
		{...$$restProps}
		class={twMerge(
			'w-full border autofill:bg-red-500 px-4 py-2 focus:outline outline-zinc-300 dark:outline-zinc-800 rounded-md bg-white dark:bg-zinc-900 transition-all dark:border-zinc-700',
			$$props.class,
		)}
		placeholder="" />

	{#if $$slots.default}
		<div class="absolute top-1/2 right-2 -translate-y-1/2">
			<slot />
		</div>
	{/if}
</div>
