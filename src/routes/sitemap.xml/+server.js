export const prerender = true;

export async function GET() {
	const siteUrl = 'https://ansorkotamadiun.or.id';
	
	// Dynamically import all page routes
	const pages = import.meta.glob('/src/routes/**/+page.svelte');
	
	const routes = Object.keys(pages).map((path) => {
		// Convert path like '/src/routes/pdf-tools/split/+page.svelte' to '/pdf-tools/split'
		let route = path.replace('/src/routes', '').replace('/+page.svelte', '');
		if (route === '') route = '/';
		return route;
	});

	// Filter out dynamic routes (e.g. ones with brackets if any exist)
	const filteredRoutes = routes.filter(route => !route.includes('['));

	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${filteredRoutes
	.map(
		(route) => `	<url>
		<loc>\${siteUrl}\${route}</loc>
		<changefreq>weekly</changefreq>
		<priority>\${route === '/' ? '1.0' : '0.8'}</priority>
	</url>`
	)
	.join('\n')}
</urlset>`;

	return new Response(sitemap, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'max-age=0, s-maxage=3600'
		}
	});
}
