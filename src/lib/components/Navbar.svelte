<script>
    import { HelpCircle, Menu, X } from '@lucide/svelte';
    import { slide } from 'svelte/transition';

    let isOpen = $state(false);

    function toggleMenu() {
        isOpen = !isOpen;
    }
</script>

<nav class="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md shadow-[0_10px_30px_-10px_rgba(0,0,0,0.04)]">
    <div class="flex justify-between items-center px-gutter max-w-container-max mx-auto h-20">
        <a class="flex items-center gap-2" href="/pdf-tools" onclick={() => isOpen = false}>
            <HelpCircle class="text-primary text-3xl"
                style="font-variation-settings: 'FILL' 1;" />
            <span class="font-display text-headline-md font-extrabold text-primary">AnsorPDF</span>
        </a>
        <div class="hidden md:flex items-center gap-stack-lg">
            <a class="text-on-surface-variant hover:text-primary-container transition-colors duration-200 font-body-md text-body-md"
                href="/">Home</a>
            <a class="text-on-surface-variant hover:text-primary-container transition-colors duration-200 font-body-md text-body-md"
                href="/pdf-tools#tools">Tools</a>
            <a class="text-on-surface-variant hover:text-primary-container transition-colors duration-200 font-body-md text-body-md"
                href="/pdf-tools#privacy">Privacy</a>
        </div>
        <div class="flex items-center gap-stack-md md:hidden">
            <button onclick={toggleMenu} class="flex items-center justify-center w-10 h-10 text-on-surface">
                {#if isOpen}
                    <X class="" />
                {:else}
                    <Menu class="" />
                {/if}
            </button>
        </div>
    </div>
</nav>

<!-- Mobile Menu Overlay -->
{#if isOpen}
    <div class="fixed inset-0 z-40 bg-surface md:hidden pt-24" transition:slide={{ duration: 300 }}>
        <div class="flex flex-col gap-6 px-gutter">
            <a onclick={toggleMenu} class="text-on-surface hover:text-primary transition-colors duration-200 font-display text-headline-sm font-semibold border-b border-outline-variant/30 pb-4"
                href="/">Home</a>
            <a onclick={toggleMenu} class="text-on-surface hover:text-primary transition-colors duration-200 font-display text-headline-sm font-semibold border-b border-outline-variant/30 pb-4"
                href="/pdf-tools#tools">Tools</a>
            <a onclick={toggleMenu} class="text-on-surface hover:text-primary transition-colors duration-200 font-display text-headline-sm font-semibold border-b border-outline-variant/30 pb-4"
                href="/pdf-tools#privacy">Privacy</a>
        </div>
    </div>
{/if}
