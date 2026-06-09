<script>
    import { ArrowRight } from '@lucide/svelte';
    let { title, description, icon: Icon, href, tag, tagStyle, colSpan } = $props();
</script>

<a class="group relative bg-surface-container-lowest rounded-DEFAULT border border-outline-variant p-6 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_-12px_rgba(0,155,76,0.1)] hover:-translate-y-1 transition-all duration-300 flex flex-col h-full {colSpan ? 'lg:col-span-2' : ''}"
    href={href}>
    {#if tag}
        <div class="absolute top-6 right-6 {tagStyle} px-2 py-1 rounded-full font-label-caps text-label-caps">
            {tag}
        </div>
    {/if}
    <div class="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center mb-4 group-hover:bg-primary-container/20 transition-colors">
        <Icon class="text-primary w-6 h-6" />
    </div>
    <h3 class="font-headline-md text-headline-md text-on-surface mb-2">{title}</h3>
    <p class="font-body-sm text-body-sm text-on-surface-variant flex-grow max-w-md">{description}</p>
    <div class="mt-4 flex items-center text-primary font-body-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300">
        Use Tool <ArrowRight class="w-4 h-4 ml-1" />
    </div>
</a>
