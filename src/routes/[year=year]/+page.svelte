<script lang="ts">
	import type { PageProps } from './$types';
	import YearPage from '#lib/components/YearPage.svelte';

	let { data }: PageProps = $props();
</script>

<YearPage data={data.year} />
