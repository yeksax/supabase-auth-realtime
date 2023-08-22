<script lang="ts">
	import { page } from '$app/stores';
	import Avatar from '../avatar.svelte';

</script>

<a href="/profile" class="px-4 py-1.5 hover:bg-zinc-100 rounded-lg transition-all flex gap-4">
	<Avatar
		rounded
		alt="Avatar"
		src={$page.data.user_data.image}
		size={36}
		fallback={$page.data.user_data.name[0].toLowerCase()}
	/>

	<div class="flex flex-col justify-between">
		<span class="text-zinc-700 text-sm font-semibold">{$page.data.user_data.name}</span>
		<span>{$page.data.user_data.email}</span>
	</div>
</a>
