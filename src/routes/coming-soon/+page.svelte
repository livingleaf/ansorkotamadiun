<script>
    import { Wrench, ArrowLeft } from '@lucide/svelte';
</script>

<div class="max-w-4xl mx-auto px-gutter py-32 text-center flex flex-col items-center">
    <div class="w-24 h-24 rounded-full bg-surface-container flex items-center justify-center mb-8">
        <Wrench class="text-[48px] text-primary" />
    </div>
    <h1 class="font-display text-display text-on-surface mb-4">Coming Soon</h1>
    <p class="font-body-lg text-on-surface-variant max-w-lg mb-12">
        We're working hard to bring this feature to you. All our tools are built to run 100% locally in your browser for ultimate privacy.
    </p>
    <a href="/tools" class="bg-primary hover:bg-primary-container text-on-primary font-headline-md text-[18px] px-8 py-4 rounded-full transition-all flex items-center justify-center gap-2 bento-hover">
        <ArrowLeft class="" />
        Back to Tools
    </a>
</div>
