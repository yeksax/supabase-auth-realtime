<script lang="ts">
	import { twMerge } from 'tailwind-merge';

	export let label: string = '';
	export let preventPlaceholderMove = false;
	export let value = '';
</script>

<div class="relative group bg-white">
	<div
		class="absolute {value.length > 0 && !preventPlaceholderMove
			? '-top-1/2 translate-y-1/3'
			: 'pointer-events-none top-1/2 -translate-y-1/2 text-zinc-400'} left-2 font-medium transition-all px-2 bg-white {preventPlaceholderMove &&
		value.length
			? 'opacity-0 duration-0'
			: ''}">
		{label}
	</div>

	<input
		type="text"
		bind:value
		{...$$restProps}
		class={twMerge('w-full border px-4 py-2 rounded-md', $$props.class)}
		placeholder="" />

	{#if $$slots.default}
		<div
			class="p-1 transition-all border absolute right-2 top-1/2 -translate-y-1/2 group-hover:opacity-100 opacity-0 flex gap-2 items-center rounded-md">
			<slot />
		</div>
	{/if}
</div>
