<script>
    import { ArrowLeft, FileUp, AlertCircle, FileText, X, Loader2, SplitSquareHorizontal, Download } from '@lucide/svelte';

    import { PDFDocument } from 'pdf-lib';

    let file = $state(null);
    let totalPages = $state(0);
    let rangeInput = $state('');
    let isProcessing = $state(false);
    let splitPdfUrl = $state(null);
    let error = $state(null);

    async function handleFile(event) {
        const selectedFile = event.target.files[0];
        if (!selectedFile) return;

        file = selectedFile;
        splitPdfUrl = null;
        error = null;
        rangeInput = '';

        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await PDFDocument.load(arrayBuffer);
            totalPages = pdf.getPageCount();
        } catch (err) {
            error = "Could not read the PDF file. It might be encrypted or invalid.";
            file = null;
            totalPages = 0;
        }
    }

    function parseRanges(rangeStr, maxPage) {
        const pages = new Set();
        const parts = rangeStr.split(',').map(p => p.trim()).filter(p => p);
        
        for (const part of parts) {
            if (part.includes('-')) {
                const [startStr, endStr] = part.split('-');
                const start = parseInt(startStr);
                const end = parseInt(endStr);
                
                if (isNaN(start) || isNaN(end) || start < 1 || end > maxPage || start > end) {
                    throw new Error(`Invalid range: ${part}`);
                }
                
                for (let i = start; i <= end; i++) {
                    pages.add(i);
                }
            } else {
                const page = parseInt(part);
                if (isNaN(page) || page < 1 || page > maxPage) {
                    throw new Error(`Invalid page number: ${part}`);
                }
                pages.add(page);
            }
        }
        
        return Array.from(pages).sort((a, b) => a - b);
    }

    async function splitPdf() {
        if (!file) return;
        if (!rangeInput.trim()) {
            error = "Please enter the pages to extract.";
            return;
        }

        isProcessing = true;
        error = null;

        try {
            const pagesToExtract = parseRanges(rangeInput, totalPages);
            
            if (pagesToExtract.length === 0) {
                throw new Error("No valid pages selected.");
            }

            const arrayBuffer = await file.arrayBuffer();
            const originalPdf = await PDFDocument.load(arrayBuffer);
            
            const newPdf = await PDFDocument.create();
            // pdf-lib page indices are 0-based
            const pageIndices = pagesToExtract.map(p => p - 1);
            const copiedPages = await newPdf.copyPages(originalPdf, pageIndices);
            
            copiedPages.forEach((page) => newPdf.addPage(page));
            
            const pdfBytes = await newPdf.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            splitPdfUrl = URL.createObjectURL(blob);
        } catch (err) {
            error = err.message || "An error occurred while splitting the PDF.";
            console.error(err);
        } finally {
            isProcessing = false;
        }
    }

    function removeFile() {
        file = null;
        totalPages = 0;
        rangeInput = '';
        splitPdfUrl = null;
        error = null;
    }
</script>

<div class="max-w-4xl mx-auto px-gutter py-20">
    <div class="mb-8">
        <a href="/tools" class="inline-flex items-center text-primary hover:text-primary-container font-body-md transition-colors mb-4 group">
            <ArrowLeft class="mr-1 group-hover:-translate-x-1 transition-transform" />
            Back to Tools
        </a>
        <h1 class="font-display text-headline-lg md:text-display text-on-surface mb-2">Split PDF</h1>
        <p class="font-body-lg text-on-surface-variant">Extract specific pages from your PDF file.</p>
    </div>

    {#if !file}
        <div class="bg-surface-container-lowest rounded-DEFAULT border-2 border-dashed border-outline-variant p-12 text-center hover:border-primary transition-colors cursor-pointer relative"
            role="button" tabindex="0">
            <input type="file" accept="application/pdf" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onchange={handleFile} />
            <div class="w-16 h-16 rounded-full bg-primary-container/20 flex items-center justify-center mx-auto mb-4">
                <FileUp class="text-[32px] text-primary" />
            </div>
            <p class="font-headline-md text-on-surface mb-2">Drag & drop a PDF here</p>
            <p class="font-body-sm text-on-surface-variant">or click to browse</p>
        </div>
    {/if}

    {#if error}
        <div class="mt-6 p-4 bg-error-container text-on-error-container rounded-lg font-body-md flex items-start gap-2">
            <AlertCircle class="" />
            <p>{error}</p>
        </div>
    {/if}

    {#if file}
        <div class="mt-8 bg-surface-container-lowest border border-outline-variant rounded-DEFAULT p-6 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.04)]">
            <div class="flex items-center justify-between mb-6 pb-6 border-b border-outline-variant">
                <div class="flex items-center gap-4 overflow-hidden">
                    <div class="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center flex-shrink-0">
                        <FileText class="text-primary text-[24px]" />
                    </div>
                    <div>
                        <h3 class="font-headline-md text-on-surface truncate max-w-sm" title={file.name}>{file.name}</h3>
                        <p class="font-body-sm text-on-surface-variant">{totalPages} pages total</p>
                    </div>
                </div>
                <button class="text-on-surface-variant hover:text-error transition-colors flex items-center justify-center w-10 h-10 rounded-full hover:bg-error-container/50" onclick={removeFile} aria-label="Remove file">
                    <X class="" />
                </button>
            </div>

            <div class="mb-8">
                <label for="page-range" class="block font-headline-md text-on-surface mb-2">Pages to Extract</label>
                <p class="font-body-sm text-on-surface-variant mb-4">e.g., 1-3, 5, 8-10</p>
                <input 
                    id="page-range" 
                    type="text" 
                    bind:value={rangeInput}
                    placeholder="Enter page ranges..."
                    class="w-full h-12 px-4 bg-surface-container-low border border-outline-variant rounded-lg font-body-md text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm"
                />
            </div>

            <div class="flex flex-col sm:flex-row gap-4 items-center">
                <button 
                    class="w-full sm:w-auto bg-primary hover:bg-primary-container text-on-primary font-headline-md text-[18px] px-8 py-4 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 bento-hover"
                    onclick={splitPdf}
                    disabled={isProcessing || !rangeInput.trim()}>
                    {#if isProcessing}
                        <Loader2 class="animate-spin" style="animation: spin 1s linear infinite;" />
                        Processing...
                    {:else}
                        <SplitSquareHorizontal class="" />
                        Extract Pages
                    {/if}
                </button>
                
                {#if splitPdfUrl}
                    <a 
                        href={splitPdfUrl} 
                        download={`extracted-${file.name}`}
                        class="w-full sm:w-auto bg-surface-container-high hover:bg-surface-variant text-on-surface font-headline-md text-[18px] px-8 py-4 rounded-full transition-all flex items-center justify-center gap-2 bento-hover">
                        <Download class="" />
                        Download PDF
                    </a>
                {/if}
            </div>
        </div>
    {/if}
</div>

<style>
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
</style>
