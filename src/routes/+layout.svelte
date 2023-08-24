<script lang="ts">
	import Sidebar from '$lib/components/navigation/sidebar.svelte';
	import { onMount } from 'svelte';
	import '../app.css';
	import { invalidate } from '$app/navigation';
	import { page } from '$app/stores';
	import { minifiedSidebar } from '$lib/stores';

	export let data;

	let { supabase, session } = data;
	$: ({ supabase, session } = data);

	onMount(() => {
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((event, _session) => {
			if (_session?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => subscription.unsubscribe();
	});

	$: minifiedSidebar.set($page.url.pathname === '/auth');
</script>

<Sidebar />
<main class="flex-1 h-full flex flex-col justify-between">
	<slot />
</main>
