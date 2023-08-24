<script lang="ts">
	// 0.6 kB
	import { page } from '$app/stores';
	import Button from '$lib/components/form/button.svelte';
	import { faGithub, faGoogle } from '@fortawesome/free-brands-svg-icons';
	import { faKey } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import { fade } from 'svelte/transition';
	import { twMerge } from 'tailwind-merge';
	import SignInForm from './sign-in-form.svelte';
	import SignUpForm from './sign-up-form.svelte';

	export let form;
	export let data;
	$: ({ supabase } = data);

	let error: string | null = null;
	let message: string | null = null;

	$: redirectTo = $page.url.origin + $page.url.searchParams.get('next') ?? '/';
	$: if (form?.error) error = form?.error;
	$: if (form?.message) message = form?.message;

	async function signInWithGithub() {
		const { data, error } = await supabase.auth.signInWithOAuth({
			provider: 'github',
			options: {
				redirectTo,
			},
		});
	}

	let isSigningIn = true;

	const signInToggleClasses =
		'disabled:bg-zinc-50 rounded first-of-type:rounded-l-md last-of-type:rounded-r-md dark:text-zinc-400 enabled:dark:hover:text-zinc-50 dark:disabled:bg-zinc-700 w-full font-medium transition-all hover:bg-zinc-100 dark:hover:bg-zinc-800 gap-4 text-center px-4 py-1 enabled:hover:text-zinc-700 text-zinc-500';
</script>

<div
	class="mx-auto flex flex-col gap-4 absolute left-1/2 -translate-x-1/2 top-12 w-[26rem] justify-center items-center text-xs bg-white dark:bg-zinc-900 dark:border-zinc-800 rounded-lg border py-6">
	<div class="px-4 flex flex-col gap-4 w-full">
		<h1 class="ml-2 text-lg font-medium">Faça login para continuar</h1>

		<div class="flex p-0.5 rounded-lg border dark:border-zinc-800 gap-0.5 w-full">
			<button
				type="button"
				on:click={() => (isSigningIn = true)}
				disabled={isSigningIn}
				class={signInToggleClasses}>Já sou usuário</button>
			<button
				type="button"
				on:click={() => (isSigningIn = false)}
				disabled={!isSigningIn}
				class={twMerge(signInToggleClasses)}>Criar nova conta</button>
		</div>
	</div>

	<div class="flex flex-col w-full">
		{#if isSigningIn}
			<SignInForm {redirectTo} />
		{:else}
			<SignUpForm />
		{/if}

		{#if error}
			<span in:fade out:fade class="text-red-400 text-xs text-right mr-4">
				{error}
			</span>
		{/if}

		{#if message}
			<span in:fade out:fade class="text-emerald-500 text-xs text-right">
				{message}
			</span>
		{/if}

		<div class="flex flex-col gap-4 px-8 mt-6">
			<div class="flex gap-4 items-center text-zinc-400 dark:text-zinc-700">
				<span class="flex-1 border-b border-zinc-400 dark:border-zinc-700" />
				ou
				<span class="flex-1 border-b border-zinc-400 dark:border-zinc-700" />
			</div>
			<Button type="button" onclick={signInWithGithub}>
				<Fa icon={faGithub} />
				Continuar com Github
			</Button>
		</div>
	</div>
</div>

<!-- 
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
 -->
