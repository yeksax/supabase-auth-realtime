<script lang="ts">
	import { page } from '$app/stores';
	import { history } from '$lib/stores';
	import type { MessageType } from '$lib/types';
	import { onMount } from 'svelte';
	import { SendIcon } from 'svelte-feather-icons';
	import Input from '../form/input.svelte';
	import Message from './message.svelte';

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
					history.set(data);
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
				(payload) => history.update((prev) => [...prev, payload.new as MessageType]),
			)
			.subscribe();

		const presenceChannel = supabase.channel('users', {
			config: {
				presence: {
					key: session!.user.email,
				},
			},
		});

		presenceChannel
			.on('presence', { event: 'sync' }, () => {
				const newState = presenceChannel.presenceState();
			})
			.on('presence', { event: 'join' }, ({ key }) => {
				if (key === presenceChannel.params.config.presence?.key) return;
				history.update((prev) => [...prev, `${key} entrou no chat`]);
			})
			.on('presence', { event: 'leave' }, ({ key }) => {
				if (key === presenceChannel.params.config.presence?.key) return;
				history.update((prev) => [...prev, `${key} saiu do chat`]);
			})
			.subscribe(async (status) => {
				if (status === 'SUBSCRIBED') {
					const presenceTrackStatus = await presenceChannel.track({
						user: 'user-1',
						online_at: new Date().toISOString(),
					});
				}
			});
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
	{#each $history as data}
		{#if typeof data === 'string'}
			<span class="text-zinc-500 text-xs text-center w-full">
				{data}
			</span>
		{:else}
			<Message message={data} />
		{/if}
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
