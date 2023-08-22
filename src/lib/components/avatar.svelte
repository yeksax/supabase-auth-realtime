<script lang="ts">
	import { onMount } from 'svelte';

	export let src: string;
	export let size: number = 32;
	export let alt: string;
	export let fallback: string;
	export let rounded: boolean = false;

	let hasLoaded = false;

	onMount(() => {
		const loadingImage = new Image();
		loadingImage.src = src;

		loadingImage.onload = () => {
			hasLoaded = true;
		};
	});
</script>

<div class="overflow-hidden block {rounded ? 'rounded-full' : ''}" style="--size:{size}px;">
	{#if hasLoaded}
		<img {src} {alt} />
	{:else}
		<div class="w-full h-full bg-violet-500 text-white relative font-semibold">
			<code
				style="font-size: {size / 2}px; line-height: 10;"
				class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
			>
				{fallback}
			</code>
		</div>
	{/if}
</div>

<style>
	div {
		width: var(--size);
		height: var(--size);
	}
</style>
