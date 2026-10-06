<script lang="ts">
	interface Props {
		genres: string[];
		class?: string;
	}

	let { genres, class: className = '' }: Props = $props();
</script>

{#if genres.length}
	<p class="text-sm leading-snug text-ink-muted {className}">
		{#each genres as genre, i (genre)}
			{#if i > 0}<span aria-hidden="true" class="mx-1.5 text-ink-faint">·</span>{/if}<span
				>{genre}</span
			>
		{/each}
	</p>
{/if}
