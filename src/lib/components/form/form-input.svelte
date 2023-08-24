<script lang="ts">
	import { twMerge } from 'tailwind-merge';

	export let value = '';
	export let label = '';
</script>

<div class="flex justify-between items-center group px-6 py-3 first-of-type:border-t border-b dark:border-zinc-800">
	<div class="text-zinc-500 text-xs">{label}</div>

	<div class="relative w-8/12">
		<input
			type="text"
			bind:value
			{...$$restProps}
			class={twMerge(
				'w-full border px-4 py-1 focus:outline outline-zinc-300 dark:outline-zinc-800 rounded-md bg-white dark:bg-zinc-900 transition-all dark:border-zinc-700 placeholder:text-xs',
				$$props.class,
			)}
			placeholder={label} />

		{#if $$slots.default}
			<div
				class="absolute md:opacity-0 md:blur group-hover:blur-none group-hover:opacity-100 right-1 top-1/2 -translate-y-1/2 transition-all border dark:border-zinc-800 flex gap-2 items-center rounded-md">
				<slot />
			</div>
		{/if}
	</div>
</div>
