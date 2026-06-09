<script>
    import { HelpCircle } from '@lucide/svelte';
    import SEO from '$lib/components/SEO.svelte';

    import Hero from '$lib/components/Hero.svelte';
    import HowItWorks from '$lib/components/HowItWorks.svelte';
    import ToolDirectory from '$lib/components/ToolDirectory.svelte';

    const schema = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'AnsorPDF',
        applicationCategory: 'BrowserApplication',
        operatingSystem: 'Any',
        description: 'Free, secure, browser-based PDF tools for GP Ansor Kota Madiun. Split, merge, sign, and convert PDF files directly in your browser without uploading data.',
        offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'IDR'
        }
    };
</script>

<SEO 
    title="PDF Tools | Ansor Kota Madiun" 
    description="Free, secure, browser-based PDF tools for GP Ansor Kota Madiun. Process PDF files directly in your browser."
    url="/pdf-tools"
    {schema}
/>

<Hero />
<HowItWorks />
<ToolDirectory />

<section class="bg-primary/5 py-16" id="privacy">
    <div class="max-w-container-max mx-auto px-gutter text-center">
        <HelpCircle class="text-primary text-5xl mb-4"
            style="font-variation-settings: 'FILL' 1;" />
        <h2 class="font-display text-headline-lg text-on-surface mb-4">Total Privacy, Guaranteed</h2>
        <p class="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
            AnsorPDF operates entirely within your browser. We never upload, store, or view your files. Your
            sensitive data stays exactly where it belongs: on your device.
        </p>
    </div>
</section>
