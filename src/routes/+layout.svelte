<script lang="ts">
	import Sidebar from '$lib/components/navigation/sidebar.svelte';
	import { onMount } from 'svelte';
	import '../app.css';
	import { invalidate } from '$app/navigation';

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
</script>

<div class="flex h-full text-zinc-700">
	<Sidebar />
	<main class="p-6 flex-1 overflow-y-auto">
		<slot />
	</main>
</div>
