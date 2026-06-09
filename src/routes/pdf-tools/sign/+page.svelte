<script>
    import { ArrowLeft, AlertCircle, FileText, X, Pen, Loader2, PenTool, Download } from '@lucide/svelte';

    import * as pdfLib from 'pdf-lib-plus-encrypt';
    const PDFDocument = pdfLib.PDFDocument || pdfLib.default?.PDFDocument;

    let file = $state(null);
    let signatureFile = $state(null);
    let totalPages = $state(0);
    let targetPage = $state(1);
    let isProcessing = $state(false);
    let signedPdfUrl = $state(null);
    let error = $state(null);

    async function handlePdfFile(event) {
        const selectedFile = event.target.files[0];
        if (!selectedFile) return;

        file = selectedFile;
        signedPdfUrl = null;
        error = null;
        
        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await PDFDocument.load(arrayBuffer);
            totalPages = pdf.getPageCount();
            targetPage = 1;
        } catch (err) {
            error = "Could not read the PDF file. It might be encrypted or invalid.";
            file = null;
            totalPages = 0;
        }
    }

    async function handleSignatureFile(event) {
        const selectedFile = event.target.files[0];
        if (!selectedFile) return;
        signatureFile = selectedFile;
        signedPdfUrl = null;
    }

    async function signPdf() {
        if (!file || !signatureFile) return;
        
        isProcessing = true;
        error = null;

        try {
            const pdfBytes = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(pdfBytes);
            
            const sigBytes = await signatureFile.arrayBuffer();
            let embeddedImage;
            
            if (signatureFile.type === 'image/png') {
                embeddedImage = await pdfDoc.embedPng(sigBytes);
            } else if (signatureFile.type === 'image/jpeg' || signatureFile.type === 'image/jpg') {
                embeddedImage = await pdfDoc.embedJpg(sigBytes);
            } else {
                throw new Error("Signature must be a PNG or JPG image.");
            }
            
            const pageIndex = Math.max(0, Math.min(targetPage - 1, totalPages - 1));
            const page = pdfDoc.getPage(pageIndex);
            const { width, height } = page.getSize();
            
            // Calculate signature dimensions, keeping aspect ratio, max width 150
            const maxSigWidth = 150;
            const sigDims = embeddedImage.scaleToFit(maxSigWidth, maxSigWidth);
            
            // Draw signature at bottom right, 50px from edges
            page.drawImage(embeddedImage, {
                x: width - sigDims.width - 50,
                y: 50,
                width: sigDims.width,
                height: sigDims.height,
            });
            
            const savedBytes = await pdfDoc.save();
            const blob = new Blob([savedBytes], { type: 'application/pdf' });
            signedPdfUrl = URL.createObjectURL(blob);
        } catch (err) {
            error = err.message || "An error occurred while signing the PDF.";
            console.error(err);
        } finally {
            isProcessing = false;
        }
    }

    function removePdf() {
        file = null;
        totalPages = 0;
        signedPdfUrl = null;
        error = null;
    }

    function removeSignature() {
        signatureFile = null;
        signedPdfUrl = null;
    }
</script>

<div class="max-w-4xl mx-auto px-gutter py-20">
    <div class="mb-8">
        <a href="/pdf-tools" class="inline-flex items-center text-primary hover:text-primary-container font-body-md transition-colors mb-4 group">
            <ArrowLeft class="mr-1 group-hover:-translate-x-1 transition-transform" />
            Back to Tools
        </a>
        <h1 class="font-display text-headline-lg md:text-display text-on-surface mb-2">Sign PDF</h1>
        <p class="font-body-lg text-on-surface-variant">Add your electronic signature to documents locally and securely.</p>
    </div>

    {#if error}
        <div class="mb-6 p-4 bg-error-container text-on-error-container rounded-lg font-body-md flex items-start gap-2">
            <AlertCircle class="" />
            <p>{error}</p>
        </div>
    {/if}

    <div class="grid grid-cols-1 md:grid-cols-2 gap-gutter mb-8">
        <!-- PDF Upload -->
        <div class="bg-surface-container-lowest border border-outline-variant rounded-DEFAULT p-6 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.04)]">
            <h2 class="font-headline-md text-on-surface mb-4">1. Document</h2>
            {#if !file}
                <div class="border-2 border-dashed border-outline-variant p-8 text-center rounded-lg hover:border-primary transition-colors cursor-pointer relative" role="button" tabindex="0">
                    <input type="file" accept="application/pdf" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onchange={handlePdfFile} />
                    <FileText class="text-[32px] text-primary mb-2" />
                    <p class="font-body-sm text-on-surface-variant">Upload PDF to sign</p>
                </div>
            {:else}
                <div class="flex items-center justify-between p-4 bg-surface-container-low rounded-lg border border-outline-variant">
                    <div class="overflow-hidden">
                        <p class="font-body-md font-semibold text-on-surface truncate" title={file.name}>{file.name}</p>
                        <p class="font-body-sm text-on-surface-variant">{totalPages} pages</p>
                    </div>
                    <button class="text-on-surface-variant hover:text-error transition-colors p-2" onclick={removePdf} aria-label="Remove PDF">
                        <X class="" />
                    </button>
                </div>
            {/if}
        </div>

        <!-- Signature Upload -->
        <div class="bg-surface-container-lowest border border-outline-variant rounded-DEFAULT p-6 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.04)]">
            <h2 class="font-headline-md text-on-surface mb-4">2. Signature Image</h2>
            {#if !signatureFile}
                <div class="border-2 border-dashed border-outline-variant p-8 text-center rounded-lg hover:border-primary transition-colors cursor-pointer relative" role="button" tabindex="0">
                    <input type="file" accept="image/png, image/jpeg" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onchange={handleSignatureFile} />
                    <Pen class="text-[32px] text-primary mb-2" />
                    <p class="font-body-sm text-on-surface-variant">Upload PNG or JPG signature</p>
                </div>
            {:else}
                <div class="flex items-center justify-between p-4 bg-surface-container-low rounded-lg border border-outline-variant">
                    <div class="overflow-hidden">
                        <p class="font-body-md font-semibold text-on-surface truncate" title={signatureFile.name}>{signatureFile.name}</p>
                        <p class="font-body-sm text-on-surface-variant">Ready to apply</p>
                    </div>
                    <button class="text-on-surface-variant hover:text-error transition-colors p-2" onclick={removeSignature} aria-label="Remove Signature">
                        <X class="" />
                    </button>
                </div>
            {/if}
        </div>
    </div>

    {#if file && signatureFile}
        <div class="bg-surface-container-lowest border border-outline-variant rounded-DEFAULT p-6 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.04)] mb-8">
            <div class="mb-6">
                <label for="page-select" class="block font-headline-md text-on-surface mb-2">Target Page</label>
                <p class="font-body-sm text-on-surface-variant mb-4">Select which page you'd like to place the signature on (it will be drawn in the bottom right corner).</p>
                <input 
                    id="page-select" 
                    type="number" 
                    min="1" 
                    max={totalPages}
                    bind:value={targetPage}
                    class="w-full sm:w-32 h-12 px-4 bg-surface-container-low border border-outline-variant rounded-lg font-body-md text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm"
                />
            </div>

            <div class="flex flex-col sm:flex-row gap-4 items-center">
                <button 
                    class="w-full sm:w-auto bg-primary hover:bg-primary-container text-on-primary font-headline-md text-[18px] px-8 py-4 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 bento-hover"
                    onclick={signPdf}
                    disabled={isProcessing}>
                    {#if isProcessing}
                        <Loader2 class="animate-spin" style="animation: spin 1s linear infinite;" />
                        Applying...
                    {:else}
                        <PenTool class="" />
                        Apply Signature
                    {/if}
                </button>
                
                {#if signedPdfUrl}
                    <a 
                        href={signedPdfUrl} 
                        download={`signed-${file.name}`}
                        class="w-full sm:w-auto bg-surface-container-high hover:bg-surface-variant text-on-surface font-headline-md text-[18px] px-8 py-4 rounded-full transition-all flex items-center justify-center gap-2 bento-hover">
                        <Download class="" />
                        Download Signed PDF
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
