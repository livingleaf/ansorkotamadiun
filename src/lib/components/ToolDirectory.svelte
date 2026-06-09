<script>
    import ToolCard from './ToolCard.svelte';
    import { Combine, SplitSquareHorizontal, Shrink, FileText, Table, Image, ImagePlus, Lock, PenTool, ScanText, Search, UploadCloud } from '@lucide/svelte';

    let tools = [
        { id: 'merge', title: 'Merge PDF', description: 'Combine multiple PDFs and images into a single document.', icon: Combine, href: '/tools/merge', category: 'Edit', isExists: true },
        { id: 'split', title: 'Split PDF', description: 'Extract pages from your PDF or save each page as a separate PDF. Select precise page ranges for quick extraction.', icon: SplitSquareHorizontal, href: '/tools/split', category: 'Edit', colSpan: true, isExists: true },
        { id: 'compress', title: 'Compress PDF', description: 'Reduce file size while maintaining visual quality.', icon: Shrink, href: '/tools/compress', category: 'Edit', isExists: false, tag: 'COMING SOON', tagStyle: 'bg-surface-variant text-on-surface-variant' },
        { id: 'pdf-to-word', title: 'PDF to Word', description: 'Convert your PDF to an editable Word document.', icon: FileText, href: '/tools/pdf-to-word', category: 'Convert', isExists: false, tag: 'COMING SOON', tagStyle: 'bg-surface-variant text-on-surface-variant' },
        { id: 'pdf-to-excel', title: 'PDF to Excel', description: 'Extract data straight from PDFs into Excel spreadsheets.', icon: Table, href: '/tools/pdf-to-excel', category: 'Convert', isExists: false, tag: 'COMING SOON', tagStyle: 'bg-surface-variant text-on-surface-variant' },
        { id: 'pdf-to-jpg', title: 'PDF to JPG', description: 'Extract images from your PDF or convert each page to a JPG.', icon: Image, href: '/tools/pdf-to-jpg', category: 'Convert', isExists: true },
        { id: 'image-to-pdf', title: 'Image to PDF', description: 'Convert images (JPG, PNG) into a single PDF document.', icon: ImagePlus, href: '/tools/image-to-pdf', category: 'Convert', isExists: true },
        { id: 'protect', title: 'Protect PDF', description: 'Encrypt your PDF with a password to prevent unauthorized access.', icon: Lock, href: '/tools/protect', category: 'Secure', isExists: true },
        { id: 'sign', title: 'Sign PDF', description: 'Add your electronic signature to documents effortlessly.', icon: PenTool, href: '/tools/sign', category: 'Secure', isExists: true },
        { id: 'ocr', title: 'OCR PDF', description: 'Make text within scanned documents searchable and selectable. Powered by local WASM for ultimate privacy.', icon: ScanText, href: '/tools/ocr', category: 'Convert', colSpan: true, isExists: false, tag: 'COMING SOON', tagStyle: 'bg-surface-variant text-on-surface-variant' }
    ];

    let searchQuery = $state('');
    let activeFilter = $state('All Tools');
    
    let filters = ['All Tools', 'Edit', 'Convert', 'Secure'];

    let filteredTools = $derived(tools.filter(tool => {
        let matchesSearch = tool.title.toLowerCase().includes(searchQuery.toLowerCase()) || tool.description.toLowerCase().includes(searchQuery.toLowerCase());
        let matchesFilter = activeFilter === 'All Tools' || tool.category === activeFilter;
        return matchesSearch && matchesFilter;
    }));
</script>

<section class="max-w-container-max mx-auto px-gutter py-20" id="tools">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-stack-md">
        <div class="max-w-2xl">
            <h2 class="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-4">
                Every tool you need to work with PDFs in one place
            </h2>
            <p class="font-body-lg text-body-lg text-on-surface-variant">
                Merge, split, compress, convert, and secure your documents locally. Privacy-first, lightning-fast.
            </p>
        </div>
        <div class="w-full md:w-auto flex-shrink-0 relative">
            <Search class="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" />
            <input
                bind:value={searchQuery}
                class="w-full md:w-[300px] h-12 pl-12 pr-4 bg-surface-container-lowest border border-outline-variant rounded-full font-body-md text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm"
                placeholder="Search tools..." type="text" />
        </div>
    </div>
    
    <div class="flex items-center gap-3 mb-8 overflow-x-auto no-scrollbar pb-2">
        {#each filters as filter}
            <button
                onclick={() => activeFilter = filter}
                class="px-5 py-2 rounded-full font-body-md font-medium whitespace-nowrap transition-colors {activeFilter === filter ? 'bg-primary text-on-primary' : 'bg-surface-container-lowest border border-outline-variant text-on-surface-variant hover:bg-surface-container hover:text-primary'}">
                {filter}
            </button>
        {/each}
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-gutter">
        {#each filteredTools as tool (tool.id)}
            <ToolCard {...tool} href={tool.isExists === false ? '/coming-soon' : tool.href} />
        {/each}
    </div>
    
    <!-- <div class="mt-16 bg-surface-container-low rounded-lg p-12 flex flex-col items-center justify-center border-2 border-dashed border-primary/40 hover:border-primary/80 transition-colors cursor-pointer group">
        <div class="w-20 h-20 rounded-full bg-surface-container-highest flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <UploadCloud class="text-[40px] text-primary" />
        </div>
        <h3 class="font-headline-md text-headline-md text-on-surface mb-2">Drag and drop to auto-detect tool</h3>
        <p class="font-body-sm text-body-sm text-on-surface-variant text-center max-w-md mb-6">
            Not sure which tool you need? Drop your file here and we'll suggest the best actions based on its format.
        </p>
        <button class="bg-primary text-on-primary px-8 py-3 rounded-full font-body-md font-semibold hover:bg-primary-container transition-all shadow-sm">
            Browse Files
        </button>
    </div> -->
</section>
