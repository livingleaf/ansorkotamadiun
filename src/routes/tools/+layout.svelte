<script>
	import '../../app.css';
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<title>AnsorPDF - Local PDF Tools</title>
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
	<link
		href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Manrope:wght@600;700;800&family=JetBrains+Mono:wght@500&display=swap"
		rel="stylesheet" />
</svelte:head>

<div class="min-h-screen flex flex-col">
	<Navbar />
	<main class="pt-24 pb-stack-lg grow">
		{@render children()}
	</main>
	<Footer />
</div>
