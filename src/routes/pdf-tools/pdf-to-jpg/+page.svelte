<script>
    import { ArrowLeft, FileUp, AlertCircle, FileText, Loader2, X, Download } from '@lucide/svelte';

    import * as pdfjsLib from 'pdfjs-dist';
    import workerSrc from 'pdfjs-dist/build/pdf.worker.mjs?url';

    // Set the workerSrc for PDF.js
    if (typeof window !== 'undefined') {
        pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;
    }

    let file = $state(null);
    let isProcessing = $state(false);
    let extractedImages = $state([]);
    let error = $state(null);

    async function handleFile(event) {
        const selectedFile = event.target.files[0];
        if (!selectedFile) return;

        file = selectedFile;
        extractedImages = [];
        error = null;
        
        // Auto start conversion
        convertPdfToJpg();
    }

    async function convertPdfToJpg() {
        if (!file) return;

        isProcessing = true;
        error = null;
        extractedImages = [];

        try {
            const arrayBuffer = await file.arrayBuffer();
            const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
            const pdf = await loadingTask.promise;
            const totalPages = pdf.numPages;

            for (let i = 1; i <= totalPages; i++) {
                const page = await pdf.getPage(i);
                
                // Scale 2 provides a good balance between quality and performance
                const scale = 2.0; 
                const viewport = page.getViewport({ scale });
                
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                const renderContext = {
                    canvasContext: context,
                    viewport: viewport
                };

                await page.render(renderContext).promise;
                
                const jpgUrl = canvas.toDataURL('image/jpeg', 0.9);
                
                // Extract original filename without extension
                const baseName = file.name.replace(/\.[^/.]+$/, "");
                
                extractedImages.push({
                    url: jpgUrl,
                    filename: `${baseName}-page-${i}.jpg`,
                    pageNum: i
                });
                
                // Trigger reactivity incrementally so user sees progress
                extractedImages = [...extractedImages];
            }
        } catch (err) {
            error = "Failed to convert PDF. Ensure it's a valid PDF and not password protected.";
            console.error(err);
        } finally {
            isProcessing = false;
        }
    }

    function removeFile() {
        file = null;
        extractedImages = [];
        error = null;
    }
</script>

<div class="max-w-6xl mx-auto px-gutter py-20">
    <div class="mb-8 max-w-4xl mx-auto">
        <a href="/pdf-tools" class="inline-flex items-center text-primary hover:text-primary-container font-body-md transition-colors mb-4 group">
            <ArrowLeft class="mr-1 group-hover:-translate-x-1 transition-transform" />
            Back to Tools
        </a>
        <h1 class="font-display text-headline-lg md:text-display text-on-surface mb-2">PDF to JPG</h1>
        <p class="font-body-lg text-on-surface-variant">Convert each page of your PDF into high-quality JPG images directly in your browser.</p>
    </div>

    {#if !file}
        <div class="max-w-4xl mx-auto bg-surface-container-lowest rounded-DEFAULT border-2 border-dashed border-outline-variant p-12 text-center hover:border-primary transition-colors cursor-pointer relative"
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
        <div class="max-w-4xl mx-auto mt-6 p-4 bg-error-container text-on-error-container rounded-lg font-body-md flex items-start gap-2">
            <AlertCircle class="" />
            <p>{error}</p>
        </div>
    {/if}

    {#if file}
        <div class="mt-8">
            <div class="max-w-4xl mx-auto flex items-center justify-between mb-8 p-4 bg-surface-container-lowest border border-outline-variant rounded-lg bento-shadow">
                <div class="flex items-center gap-4 overflow-hidden">
                    <div class="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center flex-shrink-0">
                        <FileText class="text-primary text-[24px]" />
                    </div>
                    <div>
                        <h3 class="font-headline-md text-on-surface truncate max-w-sm" title={file.name}>{file.name}</h3>
                        <p class="font-body-sm text-on-surface-variant">{isProcessing ? 'Converting...' : `${extractedImages.length} images extracted`}</p>
                    </div>
                </div>
                <div class="flex items-center gap-2">
                    {#if isProcessing}
                        <Loader2 class="animate-spin text-primary" style="animation: spin 1s linear infinite;" />
                    {/if}
                    <button class="text-on-surface-variant hover:text-error transition-colors flex items-center justify-center w-10 h-10 rounded-full hover:bg-error-container/50" onclick={removeFile} aria-label="Remove file">
                        <X class="" />
                    </button>
                </div>
            </div>

            {#if extractedImages.length > 0}
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
                    {#each extractedImages as image}
                        <div class="bg-surface-container-lowest border border-outline-variant rounded-DEFAULT overflow-hidden bento-shadow flex flex-col">
                            <div class="bg-surface-container-low aspect-[3/4] flex items-center justify-center p-4 relative group">
                                <img src={image.url} alt={`Page ${image.pageNum}`} class="max-w-full max-h-full object-contain shadow-sm border border-outline-variant/30" />
                                <div class="absolute inset-0 bg-inverse-surface/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <a 
                                        href={image.url} 
                                        download={image.filename}
                                        class="bg-primary text-on-primary font-headline-md px-6 py-3 rounded-full flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                                        <Download class="" />
                                        Download
                                    </a>
                                </div>
                            </div>
                            <div class="p-4 flex items-center justify-between bg-surface-container-lowest">
                                <span class="font-headline-md text-on-surface">Page {image.pageNum}</span>
                                <a 
                                    href={image.url} 
                                    download={image.filename}
                                    class="text-primary hover:text-primary-container transition-colors"
                                    aria-label={`Download Page ${image.pageNum}`}>
                                    <Download class="" />
                                </a>
                            </div>
                        </div>
                    {/each}
                </div>
            {/if}
        </div>
    {/if}
</div>

<style>
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
</style>
