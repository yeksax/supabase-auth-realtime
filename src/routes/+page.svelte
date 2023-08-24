<script lang="ts">
	import { goto } from '$app/navigation';
	import Card from '$lib/components/card.svelte';
	import MessageApp from '../lib/components/messaging/message-app.svelte';

	export let data;
	$: ({ session } = data);

	async function signOut() {
		await data.supabase.auth.signOut();
	}
</script>

<h1 class="font-semibold text-2xl">
	Realtime com
	<span class="font-bold text-[#3ecf8e]"> Supabase </span>
</h1>

<div class="flex w-full h-[84vh] gap-6">
	<Card class="w-2/3">
		<h3
			class="font-medium absolute z-10 left-6 top-4 px-3 py-1 bg-zinc-50 dark:bg-zinc-800 rounded-md text-sm flex items-center gap-4">
			<span
				class="rounded-full h-2 aspect-square border dark:border-zinc-800 {session
					? 'bg-green-500'
					: 'bg-red-500'}" />
			Realtime chat
		</h3>
		{#if session}
			<MessageApp />
		{:else}
			<div
				class="text-lg text-zinc-400 dark:text-zinc-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
				<a href="/auth" class="text-blue-400">Autentifique-se</a>
				para conversar
			</div>
		{/if}
	</Card>
	<Card class="w-1/3">
		<div class="flex gap-3 justify-between items-center">
			<span
				class="rounded-full h-2 aspect-square border dark:border-zinc-800 {session
					? 'bg-green-500'
					: ''}" />
			<h3 class="font-medium flex-1">Status da sessão</h3>
			<span>{session ? session.user.role : session}</span>
		</div>

		<div class="flex-1 text-sm">
			Expiremente visitar <button
				class="text-blue-400"
				on:click={() =>
					goto('/protected', {
						invalidateAll: true,
						replaceState: true,
					})}>
				/protected
			</button>

			<div class="text-xs mt-1.5 text-zinc-500">
				{#if session}
					O esperado é que você veja uma página dizendo que é única para quem está autentificado
				{:else}
					O esperado é que você seja redirectionado para a página de autenticação e ao confirmar ser
					redirecionado novamente para <button
						class="text-blue-400"
						on:click={() =>
							goto('/protected', {
								invalidateAll: true,
								replaceState: true,
							})}>
						/protected
					</button>
				{/if}
			</div>
		</div>

		{#if session}
			<button
				class="bg-red-400 hover:bg-red-500 text-white transition-all py-1 rounded-md"
				on:click={signOut}>
				Desconectar
			</button>
		{/if}
	</Card>
</div>
