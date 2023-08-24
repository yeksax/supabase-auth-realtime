<script lang="ts">
	import { page } from '$app/stores';
	import { minifiedSidebar, theme } from '$lib/stores';
	import {
		faHome,
		faLock,
		faSign,
		faSignIn,
		faSigning,
		type IconDefinition,
	} from '@fortawesome/free-solid-svg-icons';
	import { MoonIcon, SunIcon } from 'svelte-feather-icons';
	import ThemeSwitcher from '../theme-switcher.svelte';
	import NavItem from './nav-item.svelte';

	$: hasSession = $page.data.session != null;

	let groups: {
		title?: string;
		links: {
			href: string;
			name: string;
			icon: IconDefinition;
			condition?: boolean;
		}[];
	}[];

	$: groups = [
		{
			links: [
				{
					href: '/',
					name: 'Home',
					icon: faHome,
				},
				{
					href: '/protected',
					name: 'Rota protegida',
					icon: faLock,
					condition: hasSession,
				},
			],
		},
		{
			links: [
				{
					href: '/auth',
					name: 'Entrar',
					icon: faSignIn,
					condition: !hasSession,
				},
			],
		},
	];
</script>

<div class="top-6 left-6 h-full {$minifiedSidebar ? 'w-max' : 'w-[20rem]'}">
	<div class="rounded-lg border dark:border-zinc-800 {$minifiedSidebar ? 'px-2 py-3' : ' px-4 py-6'} h-full text-xs flex flex-col gap-6">
		<div class="flex flex-col justify-between h-full">
			{#each groups as group, i}
				<nav class="gap-2 flex flex-col">
					{#if group.title}
						<span class="text-xs font-semibold">{group.title}</span>
					{/if}
					{#if i == groups.length - 1}
						<ThemeSwitcher />
					{/if}
					{#each group.links as link (link.href)}
						{#if link.condition == undefined || link.condition === true}
							<NavItem {...link} />
						{/if}
					{/each}
				</nav>
			{/each}
		</div>
	</div>
</div>
