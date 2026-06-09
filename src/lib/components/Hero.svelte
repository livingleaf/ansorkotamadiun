<script>
    import { ShieldCheck, ArrowRight, PlayCircle } from '@lucide/svelte';
</script>

<section class="max-w-container-max mx-auto px-gutter py-stack-lg md:py-20 flex flex-col items-center text-center">
    <div class="inline-flex items-center gap-2 bg-tertiary-fixed text-on-tertiary-fixed-variant px-4 py-2 rounded-full mb-stack-lg">
        <ShieldCheck class="text-sm" />
        <span class="font-label-caps text-label-caps">100% LOCAL PROCESSING</span>
    </div>
    <h1 class="font-display text-display md:text-[64px] text-on-surface max-w-4xl leading-tight mb-stack-md">
        Powerful PDF Tools. <br />
        <span class="text-primary">Processed Locally.</span>
    </h1>
    <p class="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mb-stack-lg">
        Merge, compress, and edit your PDFs directly in your browser. Your files never leave your device,
        ensuring total privacy and lightning-fast performance.
    </p>
    <div class="flex flex-col sm:flex-row gap-stack-md">
        <a class="bg-primary hover:bg-primary-container text-on-primary font-headline-md text-[18px] px-8 py-4 rounded-full transition-all bento-hover flex items-center justify-center gap-2"
            href="#tools">
            Start Using Tools
            <ArrowRight class="" />
        </a>
        <a class="bg-surface-container hover:bg-surface-container-high text-on-surface font-headline-md text-[18px] px-8 py-4 rounded-full transition-all flex items-center justify-center gap-2"
            href="#how-it-works">
            See How It Works
            <PlayCircle class="" />
        </a>
    </div>
</section>
