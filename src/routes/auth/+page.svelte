<script lang="ts">
	import { safeParse } from 'valibot';
	// 0.6 kB
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import Button from '$lib/components/form/button.svelte';
	import Input from '$lib/components/form/input.svelte';
	import { EmailSchema } from '$lib/utils/schemas.js';
	import { faGoogle } from '@fortawesome/free-brands-svg-icons';
	import { faEnvelope, faEye, faEyeSlash, faKey } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import { fade } from 'svelte/transition';
	import { twMerge } from 'tailwind-merge';
	import { goto } from '$app/navigation';

	export let form;
	export let data;

	$: redirectTo = $page.url.searchParams.get('next') ?? '/';

	async function signInWithPassword() {
		const { data, error: authError } = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		if (authError) {
			if (authError.message == 'Invalid login credentials') {
				error = 'Email ou senha inválidos';
			}
		} else {
			goto(redirectTo);
		}
	}

	async function signInWithGoogle() {
		const { data, error } = await supabase.auth.signInWithOAuth({
			provider: 'google',
			options: {
				redirectTo,
			},
		});
	}

	$: if (form?.error) error = form?.error;
	$: if (form?.message) message = form?.message;

	let isSigningIn = true;

	let email = '';
	let password = '';
	let confirmPassword = '';

	let passwordVisible = false;

	let { supabase } = data;
	$: ({ supabase } = data);

	let error: string | null = null;
	let message: string | null = null;

	$: {
		if (password != confirmPassword && !isSigningIn) error = 'As senhas devem ser iguais';
		else error = null;
	}

	const signInToggleClasses =
		'disabled:bg-zinc-50 rounded-sm first-of-type:rounded-l-md last-of-type:rounded-r-md dark:text-zinc-400 enabled:dark:hover:text-zinc-50 dark:disabled:bg-zinc-700 w-full font-medium transition-all hover:bg-zinc-100 dark:hover:bg-zinc-800 gap-4 text-center px-4 py-1 enabled:hover:text-zinc-700 text-zinc-500';
</script>

<div
	class="mx-auto w-[28rem] justify-center items-center text-center text-sm bg-white dark:bg-zinc-900 dark:border-zinc-800 rounded-lg border px-16 py-6 flex flex-col gap-8">
	<h1 class="text-lg font-medium">
		Acesse sua conta com
		<span class="font-bold">Supabase</span>
	</h1>

	<div class="flex p-0.5 rounded-lg border dark:border-zinc-800 gap-0.5 w-9/12">
		<button
			type="button"
			on:click={() => (isSigningIn = true)}
			disabled={isSigningIn}
			class={signInToggleClasses}>Entrar</button>
		<button
			type="button"
			on:click={() => (isSigningIn = false)}
			disabled={!isSigningIn}
			class={twMerge(signInToggleClasses)}>Cadastrar</button>
	</div>

	<div class="flex flex-col gap-4 w-full">
		{#if isSigningIn}
			<h2 class="mt-4 mb-2 font-medium text-sm text-left">
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
			<a
				href="/auth/forgot-password"
				class="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-all text-xs w-fit self-end">
				Esqueci minha senha
			</a>
			<Button onclick={signInWithPassword}>Entrar</Button>
		{:else}
			<form
				on:change={() => {
					error = null;
				}}
				method="post"
				class="flex flex-col gap-4"
				use:enhance>
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
			<span in:fade out:fade class="text-red-400 text-xs text-left">
				{error}
			</span>
		{/if}

		{#if message}
			<span in:fade out:fade class="text-green-400 text-xs text-left">
				{message}
			</span>
		{/if}

		<h2 class="mt-2 mb-2 font-medium text-sm text-left">
			<Fa icon={faKey} class="inline mr-2" /> Continuar com
			<span class="font-bold">OAuth</span>
		</h2>
		<Button type="button" onclick={signInWithGoogle}>
			<Fa icon={faGoogle} />
			Continuar com Google
		</Button>
	</div>
</div>
