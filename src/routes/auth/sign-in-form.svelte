<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Button from '$lib/components/form/button.svelte';
	import FormInput from '$lib/components/form/form-input.svelte';
	import { faEnvelope, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';

	export let password = '';
	export let email = '';
	export let error = null as string | null;
	export let redirectTo = '/';

	let passwordVisible = false;

	let { supabase } = $page.data;
	$: ({ supabase } = $page.data);

	async function signInWithPassword() {
		const { data, error: authError } = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		if (authError) {
			error = authError.message;
		} else {
			goto(redirectTo);
		}
	}
</script>

<div class="flex flex-col gap-4">
	<h2 class="mt-4 text-left ml-6">
		<Fa icon={faEnvelope} class="inline mr-2" /> Entrar com Email
	</h2>
	<div class="flex flex-col">
		<FormInput label="Email" name="email" bind:value={email} type="email" />
		<FormInput
			label="Senha"
			autocomplete="new-password"
			name="password"
			bind:value={password}
			type={passwordVisible ? 'text' : 'password'}>
			<button
				tabindex="-1"
				type="button"
				class="p-1 aspect-square text-xs"
				on:click={() => (passwordVisible = !passwordVisible)}>
				{#if passwordVisible}
					<Fa icon={faEyeSlash} />
				{:else}
					<Fa icon={faEye} />
				{/if}
			</button>
		</FormInput>
	</div>

	<Button type="button" onclick={signInWithPassword} class="mx-6">Confirmar</Button>
</div>
