<script>
	import '../app.css';
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';

	let { children } = $props();
</script>

<div class="min-h-screen flex flex-col">
	<Navbar />
	<main class="pt-24 pb-stack-lg flex-grow">
		{@render children()}
	</main>
	<Footer />
</div>
