<script>
    import { HelpCircle, Menu } from '@lucide/svelte';
</script>

<nav class="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md shadow-[0_10px_30px_-10px_rgba(0,0,0,0.04)]">
    <div class="flex justify-between items-center px-gutter max-w-container-max mx-auto h-20">
        <a class="flex items-center gap-2" href="/tools">
            <HelpCircle class="text-primary text-3xl"
                style="font-variation-settings: 'FILL' 1;" />
            <span class="font-display text-headline-md font-extrabold text-primary">AnsorPDF</span>
        </a>
        <div class="hidden md:flex items-center gap-stack-lg">
            <a class="text-on-surface-variant hover:text-primary-container transition-colors duration-200 font-body-md text-body-md"
                href="/">Home</a>
            <a class="text-on-surface-variant hover:text-primary-container transition-colors duration-200 font-body-md text-body-md"
                href="/tools#tools">Tools</a>
            <a class="text-on-surface-variant hover:text-primary-container transition-colors duration-200 font-body-md text-body-md"
                href="/tools#privacy">Privacy</a>
        </div>
        <div class="flex items-center gap-stack-md md:hidden">
            <button class="flex items-center justify-center w-10 h-10 text-on-surface">
                <Menu class="" />
            </button>
        </div>
    </div>
</nav>
