<script>
    import { ArrowLeft, AlertCircle, ImagePlus, Trash2, Loader2, FileText, Download } from '@lucide/svelte';

    import * as pdfLib from 'pdf-lib-plus-encrypt';
    const PDFDocument = pdfLib.PDFDocument || pdfLib.default?.PDFDocument;

    let files = $state([]);
    let isProcessing = $state(false);
    let convertedPdfUrl = $state(null);
    let error = $state(null);

    async function handleFiles(event) {
        const selectedFiles = Array.from(event.target.files);
        if (selectedFiles.length === 0) return;

        const newFiles = selectedFiles.map(file => ({
            file,
            name: file.name,
            previewUrl: URL.createObjectURL(file)
        }));

        files = [...files, ...newFiles];
        convertedPdfUrl = null;
        error = null;
    }

    function removeFile(index) {
        URL.revokeObjectURL(files[index].previewUrl);
        files = files.filter((_, i) => i !== index);
        convertedPdfUrl = null;
    }

    async function convertImagesToPdf() {
        if (files.length === 0) return;

        isProcessing = true;
        error = null;

        try {
            const newPdf = await PDFDocument.create();

            for (const item of files) {
                const arrayBuffer = await item.file.arrayBuffer();
                let embeddedImage;

                if (item.file.type === 'image/png') {
                    embeddedImage = await newPdf.embedPng(arrayBuffer);
                } else if (item.file.type === 'image/jpeg' || item.file.type === 'image/jpg') {
                    embeddedImage = await newPdf.embedJpg(arrayBuffer);
                } else {
                    throw new Error(`Unsupported image format: ${item.name}`);
                }

                const { width, height } = embeddedImage.scale(1);
                // Create a page with exactly the image dimensions
                const page = newPdf.addPage([width, height]);
                
                page.drawImage(embeddedImage, {
                    x: 0,
                    y: 0,
                    width: width,
                    height: height,
                });
            }

            const pdfBytes = await newPdf.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            convertedPdfUrl = URL.createObjectURL(blob);
        } catch (err) {
            error = err.message || "An error occurred while converting the images.";
            console.error(err);
        } finally {
            isProcessing = false;
        }
    }
</script>

<div class="max-w-4xl mx-auto px-gutter py-20">
    <div class="mb-8">
        <a href="/" class="inline-flex items-center text-primary hover:text-primary-container font-body-md transition-colors mb-4 group">
            <ArrowLeft class="mr-1 group-hover:-translate-x-1 transition-transform" />
            Back to Tools
        </a>
        <h1 class="font-display text-headline-lg md:text-display text-on-surface mb-2">Image to PDF</h1>
        <p class="font-body-lg text-on-surface-variant">Convert JPG and PNG images into a single PDF document perfectly sized to your images.</p>
    </div>

    {#if error}
        <div class="mb-6 p-4 bg-error-container text-on-error-container rounded-lg font-body-md flex items-start gap-2">
            <AlertCircle class="" />
            <p>{error}</p>
        </div>
    {/if}

    <div class="bg-surface-container-lowest rounded-DEFAULT border-2 border-dashed border-outline-variant p-12 text-center hover:border-primary transition-colors cursor-pointer relative mb-8"
        role="button" tabindex="0">
        <input type="file" accept="image/png, image/jpeg" multiple class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onchange={handleFiles} />
        <div class="w-16 h-16 rounded-full bg-primary-container/20 flex items-center justify-center mx-auto mb-4">
            <ImagePlus class="text-[32px] text-primary" />
        </div>
        <p class="font-headline-md text-on-surface mb-2">Drag & drop images here</p>
        <p class="font-body-sm text-on-surface-variant">or click to browse multiple files</p>
    </div>

    {#if files.length > 0}
        <div class="bg-surface-container-lowest border border-outline-variant rounded-DEFAULT p-6 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.04)]">
            <h3 class="font-headline-md text-on-surface mb-4 border-b border-outline-variant pb-4">
                Selected Images ({files.length})
            </h3>
            
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-gutter mb-8 max-h-[500px] overflow-y-auto pr-4 custom-scrollbar">
                {#each files as item, i}
                    <div class="bg-surface-container-lowest rounded-DEFAULT border border-outline-variant p-2 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_-12px_rgba(0,155,76,0.1)] transition-all duration-300 flex flex-col items-center">
                        <div class="group w-full flex items-center justify-center overflow-hidden rounded-DEFAULT mb-3 bg-surface-container relative" style="aspect-ratio: 1 / 1;">
                            <img src={item.previewUrl} alt={item.name} class="absolute inset-0 w-full h-full object-cover transition-all duration-300" />
                            
                            <!-- Semi-transparent overlay -->
                            <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                            
                            <!-- Centered Trash Button -->
                            <button 
                                class="relative z-10 w-12 h-12 bg-surface-container-lowest text-error rounded-full flex items-center justify-center shadow-lg hover:bg-error hover:text-on-error transition-all opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 duration-300 cursor-pointer"
                                onclick={() => removeFile(i)}
                                aria-label="Remove image">
                                <Trash2 class="text-[24px]" />
                            </button>
                        </div>
                        <p class="font-body-sm font-semibold text-on-surface truncate w-full text-center" title={item.name}>{item.name}</p>
                    </div>
                {/each}
            </div>

            <div class="flex sm:flex-row gap-4 items-center">
                <button 
                    class="w-full sm:w-auto bg-primary hover:bg-primary-container text-on-primary font-headline-md text-[18px] px-8 py-4 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 bento-hover"
                    onclick={convertImagesToPdf}
                    disabled={isProcessing || files.length === 0}>
                    {#if isProcessing}
                        <Loader2 class="animate-spin" style="animation: spin 1s linear infinite;" />
                        Converting...
                    {:else}
                        <FileText class="" />
                        Create PDF
                    {/if}
                </button>
                
                {#if convertedPdfUrl}
                    <a 
                        href={convertedPdfUrl} 
                        download={`converted-images.pdf`}
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
    
    .custom-scrollbar::-webkit-scrollbar {
        width: 6px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
        background: transparent; 
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
        background: rgba(0, 0, 0, 0.1); 
        border-radius: 10px;
    }
    :global(.dark) .custom-scrollbar::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.1); 
    }
</style>
