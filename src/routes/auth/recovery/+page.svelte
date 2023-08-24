<script lang="ts">
	import { page } from '$app/stores';
	import Button from '$lib/components/form/button.svelte';
	import Input from '$lib/components/form/input.svelte';
	import { fade } from 'svelte/transition';

	$: ({ supabase } = $page.data);

	let new_password = '';
	let error = undefined as string | undefined;
	let message = undefined as string | undefined;

	async function updatePassword() {
		const { error: authError } = await supabase.auth.updateUser({
			password: new_password,
		});
		error = authError?.message;
		if (!error) {
			message = 'Senha atualizada com sucesso :)';
		}
	}
</script>

<div class="grid w-full h-full place-items-center text-sm">
	<div class="w-9/12 md:w-1/2 flex flex-col gap-2">
		<h3 class="pb-4 text-base font-medium">Insira sua nova senha</h3>
		<Input
			label="Nova senha"
			name="new_password"
			bind:value={new_password}
			class="rounded-lg text-sm" />

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
			<span />
			<Button
				onclick={updatePassword}
				class="px-5 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white">Atualizar senha</Button>
		</div>
	</div>
</div>
