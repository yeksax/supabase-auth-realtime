<script>
	import { twMerge } from 'tailwind-merge';
</script>

<div
	class={twMerge(
		'rounded-lg text-sm justify-end relative px-6 py-4 box-content border dark:border-zinc-800 flex flex-col gap-4 overflow-auto',
		$$props.class,
	)}>
	<slot />
</div>
