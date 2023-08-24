<script>
	import { twMerge } from 'tailwind-merge';
</script>

<button
	{...$$restProps}
	on:click={$$props.onclick}
	on:pointerdown={$$props.onpointerdown}
	on:pointerup={$$props.onpointerup}
	class={twMerge(
		'border px-8 py-1.5 rounded-md flex dark:border-zinc-800 dark:hover:bg-zinc-800 justify-center gap-4 items-center hover:bg-zinc-100 font-medium transition-all',
		$$props.class,
	)}>
	<slot />
</button>
