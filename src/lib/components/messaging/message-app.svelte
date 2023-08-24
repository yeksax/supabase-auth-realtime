<script lang="ts">
	import { page } from '$app/stores';
	import type { MessageType } from '$lib/types';
	import { onMount } from 'svelte';
	import { SendIcon } from 'svelte-feather-icons';
	import Input from '../form/input.svelte';
	import Message from './message.svelte';
	import { messages } from '$lib/stores';

	let message = '';

	$: data = $page.data;

	$: ({ supabase, session } = data);

	onMount(() => {
		supabase
			.from('messages')
			.select(`*`)
			.order('created_at')
			.then(({ data, error }) => {
				if (data) {
					messages.set(data);
				}
			});

		supabase
			.channel('messages')
			.on(
				'postgres_changes',
				{
					event: 'INSERT',
					schema: 'public',
					table: 'messages',
				},
				(payload) => messages.update((prev) => [...prev, payload.new as MessageType]),
			)
			.subscribe();
	});

	async function sendMessage() {
		if (message === '') {
			return;
		}

		await supabase.from('messages').insert({
			content: message,
			author: session?.user.id,
			reactions: [],
		});

		message = '';
	}

	function shortcutHandler(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			sendMessage();
		}
	}

	function scrollBottom(node: HTMLElement) {
		node.scrollTo(0, node.scrollHeight);
		node.addEventListener('DOMNodeInserted', () => {
			node.scrollTo(0, node.scrollHeight);
		});
	}
</script>

<div
	use:scrollBottom
	class="flex flex-col gap-2 h-full overflow-auto pr-2 scrollbar-thin scrollbar-track-zinc-400 dark:scrollbar-track-zinc-800 dark:scrollbar-thumb-zinc-700">
	{#each $messages as message}
		<Message {message} />
	{/each}
</div>

<Input
	autofocus
	label="Envie uma mensagem..."
	preventPlaceholderMove
	bind:value={message}
	{shortcutHandler}>
	<button
		on:click={sendMessage}
		class="p-1.5 transition-all border dark:border-zinc-800 flex gap-2 items-center rounded-md">
		<SendIcon size="14" />
	</button>
</Input>
