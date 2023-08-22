<script lang="ts">
	import {
		faBell,
		faClipboardList,
		faGear,
		faHome,
		faSignIn,
		type IconDefinition,
	} from '@fortawesome/free-solid-svg-icons';
	import NavItem from './nav-item.svelte';

	import { page } from '$app/stores';

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
					href: '/mycards',
					name: 'Listas',
					icon: faClipboardList,
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
				{
					href: '/notifications',
					name: 'Notificações',
					icon: faBell,
					condition: hasSession,
				},
				{
					href: '/settings',
					name: 'Configurações',
					icon: faGear,
					condition: hasSession,
				},
			],
		},
	];
</script>

<div class="top-6 left-6 h-full p-6 w-[21rem]">
	<div class="rounded-lg bg-white border px-4 py-6 h-full text-xs flex flex-col gap-6">
		<div class="flex flex-col justify-between h-full">
			{#each groups as group}
				<nav class="gap-2 flex flex-col">
					{#if group.title}
						<span class="text-zinc-700 text-xs font-semibold">{group.title}</span>
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
