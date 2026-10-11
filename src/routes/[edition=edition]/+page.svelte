<script lang="ts">
	import type { PageProps } from './$types';
	import SpecialEditionPage from '#lib/components/special/SpecialEditionPage.svelte';

	let { data }: PageProps = $props();
</script>

<SpecialEditionPage edition={data.edition} />
