<script>
    import { ArrowLeft, FileUp, AlertCircle, Lock, X, Eye, EyeOff, Loader2, Download } from '@lucide/svelte';

    import * as pdfLib from 'pdf-lib-plus-encrypt';
    const PDFDocument = pdfLib.PDFDocument || pdfLib.default?.PDFDocument;

    let file = $state(null);
    let password = $state('');
    let isProcessing = $state(false);
    let protectedPdfUrl = $state(null);
    let error = $state(null);
    let showPassword = $state(false);

    async function handleFile(event) {
        const selectedFile = event.target.files[0];
        if (!selectedFile) return;

        file = selectedFile;
        protectedPdfUrl = null;
        error = null;
        password = '';
        
        try {
            // Just verify we can read it
            const arrayBuffer = await file.arrayBuffer();
            await PDFDocument.load(arrayBuffer);
        } catch (err) {
            error = "Could not read the PDF file. It might already be encrypted or invalid.";
            file = null;
        }
    }

    async function protectPdf() {
        if (!file) return;
        if (!password) {
            error = "Please enter a password to encrypt the document.";
            return;
        }

        isProcessing = true;
        error = null;

        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);
            
            // Encrypt the document with the provided password
            pdfDoc.encrypt({
                userPassword: password,
                ownerPassword: password,
                permissions: {
                    printing: 'highResolution',
                    modifying: false,
                    copying: false,
                    annotating: false,
                    fillingForms: false,
                    contentAccessibility: false,
                    documentAssembly: false
                }
            });
            
            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            protectedPdfUrl = URL.createObjectURL(blob);
        } catch (err) {
            error = err.message || "An error occurred while encrypting the PDF.";
            console.error(err);
        } finally {
            isProcessing = false;
        }
    }

    function removeFile() {
        file = null;
        password = '';
        protectedPdfUrl = null;
        error = null;
    }
</script>

<div class="max-w-4xl mx-auto px-gutter py-20">
    <div class="mb-8">
        <a href="/pdf-tools" class="inline-flex items-center text-primary hover:text-primary-container font-body-md transition-colors mb-4 group">
            <ArrowLeft class="mr-1 group-hover:-translate-x-1 transition-transform" />
            Back to Tools
        </a>
        <h1 class="font-display text-headline-lg md:text-display text-on-surface mb-2">Protect PDF</h1>
        <p class="font-body-lg text-on-surface-variant">Encrypt your PDF with a password to prevent unauthorized access.</p>
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
                        <Lock class="text-primary text-[24px]" />
                    </div>
                    <div>
                        <h3 class="font-headline-md text-on-surface truncate max-w-sm" title={file.name}>{file.name}</h3>
                        <p class="font-body-sm text-on-surface-variant">Ready to encrypt</p>
                    </div>
                </div>
                <button class="text-on-surface-variant hover:text-error transition-colors flex items-center justify-center w-10 h-10 rounded-full hover:bg-error-container/50" onclick={removeFile} aria-label="Remove file">
                    <X class="" />
                </button>
            </div>

            <div class="mb-8">
                <label for="pdf-password" class="block font-headline-md text-on-surface mb-2">Set Password</label>
                <p class="font-body-sm text-on-surface-variant mb-4">This password will be required to open the document.</p>
                <div class="relative w-full max-w-md">
                    <input 
                        id="pdf-password" 
                        type={showPassword ? 'text' : 'password'} 
                        bind:value={password}
                        placeholder="Enter strong password..."
                        class="w-full h-12 px-4 pr-12 bg-surface-container-low border border-outline-variant rounded-lg font-body-md text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm"
                    />
                    <button 
                        class="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors flex items-center"
                        onclick={() => showPassword = !showPassword}
                        aria-label="Toggle password visibility">
                        {#if showPassword}
  <EyeOff class=""  />
{:else}
  <Eye class=""  />
{/if}
                    </button>
                </div>
            </div>

            <div class="flex flex-col sm:flex-row gap-4 items-center">
                <button 
                    class="w-full sm:w-auto bg-primary hover:bg-primary-container text-on-primary font-headline-md text-[18px] px-8 py-4 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 bento-hover"
                    onclick={protectPdf}
                    disabled={isProcessing || !password}>
                    {#if isProcessing}
                        <Loader2 class="animate-spin" style="animation: spin 1s linear infinite;" />
                        Encrypting...
                    {:else}
                        <Lock class="" />
                        Protect PDF
                    {/if}
                </button>
                
                {#if protectedPdfUrl}
                    <a 
                        href={protectedPdfUrl} 
                        download={`protected-${file.name}`}
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
