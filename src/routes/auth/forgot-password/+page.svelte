<script lang="ts">
	import { page } from '$app/stores';
	import Button from '$lib/components/form/button.svelte';
	import Input from '$lib/components/form/input.svelte';
	import { fade } from 'svelte/transition';

	let email = '';
	$: ({ supabase } = $page.data);

	let error = undefined as string | undefined;
	let message = undefined as string | undefined;

	async function requestNewPassword() {
		const { data, error: authError } = await supabase.auth.resetPasswordForEmail(email, {
			redirectTo: `${$page.url.origin}/auth/recovery`,
		});
		error = authError?.message;
		if (!error) {
			message = 'Email de recuperação enviado para o seu e-mail :) Cheque o spam também!';
		}
	}
</script>

<div class="grid w-full h-full place-items-center text-sm">
	<div class="w-9/12 md:w-1/2 flex flex-col gap-2">
		<h3 class="pb-4 text-base font-medium">Diga o e-mail que deseja recuperar</h3>
		<Input label="Email" name="email" bind:value={email} class="rounded-lg text-sm" type="email" />

		{#if error}
			<span in:fade out:fade class="text-red-400 text-xs text-left">
				{error}
			</span>
		{/if}

		{#if message}
			<span in:fade out:fade class="text-green-400 text-xs text-left">
				{message}
			</span>
		{/if}

		<div class="flex justify-between mt-2">
			<Button class="px-5 py-1 text-xs">Voltar</Button>
			<Button
				onclick={requestNewPassword}
				class="px-5 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white"
				>Solicitar nova senha</Button>
		</div>
	</div>
</div>
