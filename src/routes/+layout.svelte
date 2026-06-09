<script>
	import SEO from '$lib/components/SEO.svelte';
	import { page } from '$app/stores';
	let { children } = $props();
</script>

<SEO 
	title={$page.data.seo?.title} 
	description={$page.data.seo?.description} 
	type={$page.data.seo?.type} 
	image={$page.data.seo?.image} 
	schema={$page.data.seo?.schema} 
/>

{@render children()}
