<script>
	let {
		title = 'Ansor Kota Madiun',
		description = 'Web resmi pimpinan cabang GP Ansor Kota Madiun',
		url = '',
		type = 'website',
		image = '',
		schema = null
	} = $props();

	const siteUrl = 'https://ansorkotamadiun.or.id';
	let fullUrl = $derived(url.startsWith('http') ? url : `${siteUrl}${url}`);
	let fullImage = $derived(image ? (image.startsWith('http') ? image : `${siteUrl}${image}`) : '');
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content={type} />
	<meta property="og:url" content={fullUrl} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	{#if fullImage}
		<meta property="og:image" content={fullImage} />
	{/if}

	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:url" content={fullUrl} />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	{#if fullImage}
		<meta name="twitter:image" content={fullImage} />
	{/if}

	<!-- JSON-LD Schema -->
	{#if schema}
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html `<script type="application/ld+json">${JSON.stringify(schema)}</script>`}
	{:else}
		<!-- Default Organization Schema -->
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html `<script type="application/ld+json">${JSON.stringify({
			'@context': 'https://schema.org',
			'@type': 'Organization',
			name: 'Ansor Kota Madiun',
			url: 'https://ansorkotamadiun.or.id',
			description: 'Web resmi pimpinan cabang GP Ansor Kota Madiun'
		})}</script>`}
	{/if}
</svelte:head>
