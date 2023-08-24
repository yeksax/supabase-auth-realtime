<script lang="ts">
	import { page } from '$app/stores';
	import { history } from '$lib/stores';
	import type { MessageType } from '$lib/types';
	import { onMount } from 'svelte';
	import { SendIcon } from 'svelte-feather-icons';
	import Input from '../form/input.svelte';
	import Message from './message.svelte';

	const RESET_TYPING_STATE_TIMEOUT = 2000;

	let message = '';
	$: data = $page.data;
	$: ({ supabase, session } = data);

	let typyingReseter: NodeJS.Timeout;
	let setTypingState = (v: boolean) => {};
	let typingUsers: Record<string, boolean> = {};

	onMount(() => {
		const presenceChannel = supabase.channel('chat__users', {
			config: {
				presence: {
					key: session!.user.email,
				},
			},
		});

		const messagesChannel = supabase.channel('messages');
		const broadcastChannel = supabase.channel('chat__broadcast');

		supabase
			.from('messages')
			.select(`*`)
			.order('created_at')
			.then(({ data, error }) => {
				if (data) {
					history.set(data);
				}
			});

		messagesChannel
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
					await presenceChannel.track({
						user: session?.user.id,
						online_at: new Date().toISOString(),
					});
				}
			});

		broadcastChannel
			.on(
				'broadcast',
				{ event: 'typing' },
				({ payload }) => (typingUsers[payload.user] = payload.typing),
			)
			.subscribe((status) => {
				if (status === 'SUBSCRIBED') {
					setTypingState = (v: boolean) => {
						if (typyingReseter) {
							clearTimeout(typyingReseter);
						}
						if (v) {
							typyingReseter = setTimeout(() => {
								setTypingState(false);
							}, RESET_TYPING_STATE_TIMEOUT);
						}

						broadcastChannel.send({
							type: 'broadcast',
							event: 'typing',
							payload: { user: session!.user.email, typing: v },
						});
					};
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

	async function shortcutHandler(e: KeyboardEvent) {
		const target = e.target as HTMLInputElement;

		if (e.key === 'Enter') {
			await sendMessage();
		}

		if (target.value === '') {
			setTypingState(false);
		} else {
			setTypingState(true);
		}
	}

	function scrollBottom(node: HTMLElement) {
		node.scrollTo(0, node.scrollHeight);
		node.addEventListener('DOMNodeInserted', () => {
			node.scrollTo(0, node.scrollHeight);
		});
	}

	function inputHandler() {
		if (message !== '') {
			setTypingState(true);
		} else {
			setTypingState(false);
		}
	}
</script>

<div
	use:scrollBottom
	class="flex flex-col gap-2 h-full overflow-auto pr-2 scrollbar-thin scrollbar-track-zinc-400 dark:scrollbar-track-zinc-800 dark:scrollbar-thumb-zinc-700">
	{#each $history as data}
		{#if typeof data === 'string'}
			<span class="text-zinc-500 text-xs text-center w-full first-of-type:mt-2 last-of-type:mb-2">
				{data}
			</span>
		{:else}
			<Message message={data} />
		{/if}
	{/each}
</div>

<div class="flex flex-col gap-2">
	{#if Object.entries(typingUsers).filter((v) => v[1]).length > 0}
		{@const users = Object.entries(typingUsers).filter((v) => v[1])}
		{@const length = users.length}
		<span class="text-zinc-500 text-xs">
			{#each users as [user, typing], i}
				{user}{i < length - 1 ? ', ' : ''}
			{/each}
			está digitando
		</span>
	{/if}
	<Input
		autofocus
		label="Envie uma mensagem..."
		preventPlaceholderMove
		onInput={inputHandler}
		bind:value={message}
		{shortcutHandler}>
		<button
			on:click={sendMessage}
			class="p-1.5 transition-all border dark:border-zinc-800 flex gap-2 items-center rounded-md">
			<SendIcon size="14" />
		</button>
	</Input>
</div>
