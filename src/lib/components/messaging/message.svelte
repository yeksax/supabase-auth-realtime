<script lang="ts">
	import { page } from '$app/stores';
	import type { MessageType } from '$lib/types';
	import Time from '../time.svelte';

	export let message: MessageType;

	$: session = $page.data.session;
</script>

<div class="flex flex-col gap-0.5">
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div
		class="max-w-[70%] group relative flex-auto break-words rounded-md dark:border-zinc-800 w-max border px-4 py-1 {message.author ===
		session?.user.id
			? 'self-end'
			: ''}">
		{message.content}

		<span class="float-right ml-2 mt-1 text-xs text-zinc-500">
			<Time time={message.created_at} />
		</span>
	</div>
</div>
