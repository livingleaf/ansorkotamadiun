<script>
    import { ArrowLeft, FileUp, AlertCircle, FileText, X, Loader2, Combine, Download } from '@lucide/svelte';

    import { PDFDocument } from 'pdf-lib';
    
    let files = $state([]);
    let isProcessing = $state(false);
    let mergedPdfUrl = $state(null);
    let error = $state(null);

    async function handleFiles(event) {
        const newFiles = Array.from(event.target.files);
        files = [...files, ...newFiles];
        mergedPdfUrl = null;
    }

    async function mergePdfs() {
        if (files.length < 2) {
            error = "Please upload at least 2 PDFs to merge.";
            return;
        }
        
        isProcessing = true;
        error = null;
        
        try {
            const mergedPdf = await PDFDocument.create();
            
            for (const file of files) {
                const arrayBuffer = await file.arrayBuffer();
                const pdf = await PDFDocument.load(arrayBuffer);
                const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
                copiedPages.forEach((page) => mergedPdf.addPage(page));
            }
            
            const mergedPdfBytes = await mergedPdf.save();
            const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
            mergedPdfUrl = URL.createObjectURL(blob);
        } catch (err) {
            error = "An error occurred while merging the PDFs. Ensure all files are valid PDFs and not encrypted.";
            console.error(err);
        } finally {
            isProcessing = false;
        }
    }
    
    function removeFile(index) {
        files = files.filter((_, i) => i !== index);
        mergedPdfUrl = null;
    }
</script>

<div class="max-w-4xl mx-auto px-gutter py-20">
    <div class="mb-8">
        <a href="/pdf-tools" class="inline-flex items-center text-primary hover:text-primary-container font-body-md transition-colors mb-4 group">
            <ArrowLeft class="mr-1 group-hover:-translate-x-1 transition-transform" />
            Back to Tools
        </a>
        <h1 class="font-display text-headline-lg md:text-display text-on-surface mb-2">Merge PDF</h1>
        <p class="font-body-lg text-on-surface-variant">Combine multiple PDFs into a single document entirely in your browser.</p>
    </div>

    <div class="bg-surface-container-lowest rounded-DEFAULT border-2 border-dashed border-outline-variant p-12 text-center hover:border-primary transition-colors cursor-pointer relative"
        role="button" tabindex="0">
        <input type="file" multiple accept="application/pdf" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onchange={handleFiles} />
        <div class="w-16 h-16 rounded-full bg-primary-container/20 flex items-center justify-center mx-auto mb-4">
            <FileUp class="text-[32px] text-primary" />
        </div>
        <p class="font-headline-md text-on-surface mb-2">Drag & drop PDFs here</p>
        <p class="font-body-sm text-on-surface-variant">or click to browse files</p>
    </div>

    {#if error}
        <div class="mt-6 p-4 bg-error-container text-on-error-container rounded-lg font-body-md flex items-start gap-2">
            <AlertCircle class="" />
            <p>{error}</p>
        </div>
    {/if}

    {#if files.length > 0}
        <div class="mt-8">
            <h3 class="font-headline-md text-on-surface mb-4">Selected Files ({files.length})</h3>
            <ul class="space-y-3 mb-8">
                {#each files as file, index}
                    <li class="flex items-center justify-between p-4 bg-surface-container-lowest border border-outline-variant rounded-lg bento-shadow">
                        <div class="flex items-center gap-3 overflow-hidden">
                            <FileText class="text-primary" />
                            <span class="font-body-md text-on-surface truncate">{file.name}</span>
                        </div>
                        <button class="text-on-surface-variant hover:text-error transition-colors" onclick={() => removeFile(index)} aria-label="Remove file">
                            <X class="" />
                        </button>
                    </li>
                {/each}
            </ul>

            <div class="flex flex-col sm:flex-row gap-4 items-center">
                <button 
                    class="w-full sm:w-auto bg-primary hover:bg-primary-container text-on-primary font-headline-md text-[18px] px-8 py-4 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 bento-hover"
                    onclick={mergePdfs}
                    disabled={isProcessing || files.length < 2}>
                    {#if isProcessing}
                        <Loader2 class="animate-spin" style="animation: spin 1s linear infinite;" />
                        Processing...
                    {:else}
                        <Combine class="" />
                        Merge PDFs
                    {/if}
                </button>
                
                {#if mergedPdfUrl}
                    <a 
                        href={mergedPdfUrl} 
                        download="merged.pdf"
                        class="w-full sm:w-auto bg-surface-container-high hover:bg-surface-variant text-on-surface font-headline-md text-[18px] px-8 py-4 rounded-full transition-all flex items-center justify-center gap-2 bento-hover">
                        <Download class="" />
                        Download Merged PDF
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
