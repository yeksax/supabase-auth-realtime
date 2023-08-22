<script lang="ts">
	import { object, string, email as isEmail, safeParse } from 'valibot'; // 0.6 kB
	import { enhance } from '$app/forms';
	import Button from '$lib/components/form/button.svelte';
	import Input from '$lib/components/form/input.svelte';
	import { faGoogle } from '@fortawesome/free-brands-svg-icons';
	import { faEnvelope, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import { EmailSchema } from '$lib/utils/schemas.js';

	export let form;
	export let data;

	async function signInWithPassword() {
		const { data, error: authError } = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		if (authError) {
			if (authError.message == 'Invalid login credentials') {
				error = 'Email ou senha inválidos';
			}
		}
	}

	async function signInWithGoogle() {
		const { data, error } = await supabase.auth.signInWithOAuth({
			provider: 'google',
		});
	}

	async function requestPassword() {
		console.log('email', email);

		if (!safeParse(EmailSchema, email).success) {
			error = 'Email inválido';
			return;
		}

		const { data, error: authError } = await supabase.auth.resetPasswordForEmail(email);

		console.log(data, authError)
	}

	let isSigningIn = true;

	let email = '';
	let password = '';
	let confirmPassword = '';

	let passwordVisible = false;

	let { supabase } = data;
	$: ({ supabase } = data);

	let error: string | null = null;

	$: {
		if (password != confirmPassword && !isSigningIn) error = 'As senhas devem ser iguais';
		else error = null;
	}
</script>

<div
	class="mx-auto w-[28rem] justify-center items-center text-center text-sm bg-white rounded-lg border px-16 py-6 flex flex-col gap-8 overflow-hidden">
	<h1 class="text-lg font-medium">
		Acesse sua conta em
		<span class="font-bold">Studies</span>
	</h1>

	<div class="flex p-0.5 rounded-lg border gap-1 w-8/12">
		<button
			type="button"
			on:click={() => (isSigningIn = true)}
			disabled={isSigningIn}
			class="disabled:bg-zinc-50 w-full font-medium transition-all hover:bg-zinc-100 gap-4 text-center rounded-md px-4 py-1 hover:text-zinc-700 text-zinc-500"
			>Entrar</button>
		<button
			type="button"
			on:click={() => (isSigningIn = false)}
			disabled={!isSigningIn}
			class="disabled:bg-zinc-50 w-full font-medium transition-all hover:bg-zinc-100 gap-4 text-center rounded-md px-4 py-1 hover:text-zinc-700 text-zinc-500"
			>Cadastrar</button>
	</div>

	<div class="flex flex-col gap-4 w-full">
		{#if isSigningIn}
			<h2 class="mt-4 font-medium text-sm text-left">
				<Fa icon={faEnvelope} class="inline mr-2" /> Continuar com
				<span class="font-bold">Email</span>
			</h2>
			<Input label="Email" bind:value={email} type="email" />
			<Input label="Senha" bind:value={password} type={passwordVisible ? 'text' : 'password'}>
				<div class="cursor-pointer aspect-square grid place-items-center text-xs w-4">
					{#if passwordVisible}
						<button type="button" on:click={() => (passwordVisible = false)}>
							<Fa icon={faEyeSlash} />
						</button>
					{:else}
						<button type="button" on:click={() => (passwordVisible = true)}>
							<Fa icon={faEye} />
						</button>
					{/if}
				</div>
			</Input>
			<button
				on:click={requestPassword}
				class="text-zinc-400 hover:text-zinc-700 transition-all text-xs w-fit self-end">
				Esqueci minha senha
			</button>
			<Button onclick={signInWithPassword}>Entrar</Button>
		{:else}
			<form method="post" class="flex flex-col gap-4" use:enhance>
				<h2 class="mt-4 font-medium text-sm text-left">
					<Fa icon={faEnvelope} class="inline mr-2" /> Criar nova conta com
					<span class="font-bold">Email</span>
				</h2>
				<Input label="Email" name="email" bind:value={email} type="email" />
				<Input
					label="Senha"
					autocomplete="new-password"
					name="password"
					bind:value={password}
					type={passwordVisible ? 'text' : 'password'}>
					<div class="cursor-pointer aspect-square grid place-items-center text-xs w-4">
						{#if passwordVisible}
							<button type="button" on:click={() => (passwordVisible = false)}>
								<Fa icon={faEyeSlash} />
							</button>
						{:else}
							<button type="button" on:click={() => (passwordVisible = true)}>
								<Fa icon={faEye} />
							</button>
						{/if}
					</div>
				</Input>
				<Input
					label="Confirmar Senha"
					preventPlaceholderMove
					autocomplete="new-password"
					bind:value={confirmPassword}
					type={passwordVisible ? 'text' : 'password'}>
					<div class="cursor-pointer aspect-square grid place-items-center text-xs w-4">
						{#if passwordVisible}
							<button type="button" on:click={() => (passwordVisible = false)}>
								<Fa icon={faEyeSlash} />
							</button>
						{:else}
							<button type="button" on:click={() => (passwordVisible = true)}>
								<Fa icon={faEye} />
							</button>
						{/if}
					</div>
				</Input>

				<Button>Confirmar</Button>
			</form>
		{/if}

		{#if error}
			<span class="text-red-400 text-xs text-left">
				{error}
			</span>
		{/if}

		<h2 class="mt-4 font-medium text-sm text-left">
			<Fa icon={faEnvelope} class="inline mr-2" /> Continuar com
			<span class="font-bold">OAuth</span>
		</h2>
		<Button type="button" onclick={signInWithGoogle}>
			<Fa icon={faGoogle} />
			Continuar com Google
		</Button>
	</div>
</div>
