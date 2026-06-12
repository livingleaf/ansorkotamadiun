<script>
    import { ArrowLeft, FileUp, AlertCircle, FileText, X, Loader2, FileSymlink, Download, Plus, FileImage } from '@lucide/svelte';
    import { PDFDocument } from 'pdf-lib';
    
    let mainFile = $state(null);
    let totalPages = $state(0);
    
    // Default 1 rule
    let rules = $state([{ id: 1, pageNumber: '', file: null }]);
    let nextId = 2;

    let isProcessing = $state(false);
    let resultPdfUrl = $state(null);
    let error = $state(null);

    async function handleMainFile(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        mainFile = file;
        resultPdfUrl = null;
        error = null;
        
        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
            totalPages = pdfDoc.getPageCount();
            
            // Auto fill first rule page number if total pages == 1 just for convenience
            if (totalPages === 1 && rules.length === 1) {
                rules[0].pageNumber = 1;
            }
        } catch (err) {
            error = "Invalid PDF file or encrypted document.";
            mainFile = null;
            totalPages = 0;
        }
    }

    function addRule() {
        rules = [...rules, { id: nextId++, pageNumber: '', file: null }];
        resultPdfUrl = null;
    }

    function removeRule(id) {
        rules = rules.filter(r => r.id !== id);
        resultPdfUrl = null;
    }

    function handleRuleFile(id, event) {
        const file = event.target.files[0];
        rules = rules.map(r => r.id === id ? { ...r, file } : r);
        resultPdfUrl = null;
    }

    function removeMainFile() {
        mainFile = null;
        totalPages = 0;
        resultPdfUrl = null;
        rules = [{ id: nextId++, pageNumber: '', file: null }];
    }

    let validationState = $derived.by(() => {
        if (!mainFile) return { valid: false, msg: "" };
        if (rules.length === 0) return { valid: false, msg: "Please add at least one replacement rule." };
        
        const pageNumbers = new Set();
        for (const rule of rules) {
            if (!rule.pageNumber) return { valid: false, msg: "Please fill in all page numbers." };
            if (!rule.file) return { valid: false, msg: "Please upload a replacement file for all rules." };
            
            const pn = parseInt(rule.pageNumber);
            if (isNaN(pn) || pn < 1 || pn > totalPages) {
                return { valid: false, msg: `Page number must be between 1 and ${totalPages}.` };
            }
            
            if (pageNumbers.has(pn)) {
                return { valid: false, msg: `Duplicate replacement for page ${pn}.` };
            }
            pageNumbers.add(pn);
        }
        return { valid: true, msg: "" };
    });

    async function processReplacement() {
        if (!validationState.valid) {
            error = validationState.msg;
            return;
        }
        
        isProcessing = true;
        error = null;
        
        try {
            const arrayBuffer = await mainFile.arrayBuffer();
            const mainPdf = await PDFDocument.load(arrayBuffer);
            
            // Sort rules descending so indices don't shift for earlier pages
            const sortedRules = [...rules].sort((a, b) => parseInt(b.pageNumber) - parseInt(a.pageNumber));
            
            for (const rule of sortedRules) {
                const targetIndex = parseInt(rule.pageNumber) - 1;
                
                // Remove original page
                mainPdf.removePage(targetIndex);
                
                const repBuffer = await rule.file.arrayBuffer();
                const fileType = rule.file.type;
                
                if (fileType === 'application/pdf') {
                    const repPdf = await PDFDocument.load(repBuffer);
                    const copiedPages = await mainPdf.copyPages(repPdf, repPdf.getPageIndices());
                    
                    for (let i = 0; i < copiedPages.length; i++) {
                        mainPdf.insertPage(targetIndex + i, copiedPages[i]);
                    }
                } else if (fileType.startsWith('image/')) {
                    let image;
                    if (fileType === 'image/jpeg' || fileType === 'image/jpg') {
                        image = await mainPdf.embedJpg(repBuffer);
                    } else if (fileType === 'image/png') {
                        image = await mainPdf.embedPng(repBuffer);
                    } else {
                        throw new Error(`Unsupported image type: ${fileType}`);
                    }
                    
                    const { width, height } = image.scale(1);
                    const page = mainPdf.insertPage(targetIndex, [width, height]);
                    page.drawImage(image, {
                        x: 0,
                        y: 0,
                        width: width,
                        height: height,
                    });
                }
            }
            
            const resultPdfBytes = await mainPdf.save();
            const blob = new Blob([resultPdfBytes], { type: 'application/pdf' });
            resultPdfUrl = URL.createObjectURL(blob);
        } catch (err) {
            error = "An error occurred during replacement. Please ensure files are valid.";
            console.error(err);
        } finally {
            isProcessing = false;
        }
    }
</script>

<div class="max-w-4xl mx-auto px-gutter py-20">
    <div class="mb-8">
        <a href="/pdf-tools" class="inline-flex items-center text-primary hover:text-primary-container font-body-md transition-colors mb-4 group">
            <ArrowLeft class="mr-1 group-hover:-translate-x-1 transition-transform" />
            Back to Tools
        </a>
        <h1 class="font-display text-headline-lg md:text-display text-on-surface mb-2">Replace PDF Page</h1>
        <p class="font-body-lg text-on-surface-variant">Swap specific pages in your PDF with a new PDF or image. Processed entirely in your browser.</p>
    </div>

    {#if !mainFile}
        <div class="bg-surface-container-lowest rounded-DEFAULT border-2 border-dashed border-outline-variant p-12 text-center hover:border-primary transition-colors cursor-pointer relative"
            role="button" tabindex="0">
            <input type="file" accept="application/pdf" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onchange={handleMainFile} />
            <div class="w-16 h-16 rounded-full bg-primary-container/20 flex items-center justify-center mx-auto mb-4">
                <FileUp class="text-[32px] text-primary" />
            </div>
            <p class="font-headline-md text-on-surface mb-2">Upload Main PDF</p>
            <p class="font-body-sm text-on-surface-variant">Drag & drop or click to browse</p>
        </div>
    {:else}
        <div class="bg-surface-container-low border border-outline-variant rounded-lg p-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-full bg-primary-container/20 flex items-center justify-center">
                    <FileText class="text-primary" />
                </div>
                <div>
                    <h3 class="font-headline-md text-on-surface">{mainFile.name}</h3>
                    <p class="font-body-sm text-on-surface-variant">
                        Total {totalPages} {totalPages === 1 ? 'page' : 'pages'}
                    </p>
                </div>
            </div>
            <button class="text-error hover:bg-error-container/20 px-4 py-2 rounded-lg font-body-md transition-colors" onclick={removeMainFile}>
                Change File
            </button>
        </div>

        <div class="mb-8">
            <h3 class="font-headline-md text-on-surface mb-4">Replacement Rules</h3>
            <div class="space-y-4">
                {#each rules as rule, index (rule.id)}
                    <div class="bg-surface-container-lowest border border-outline-variant rounded-lg p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 relative">
                        <div class="flex-shrink-0 flex flex-col">
                            <label class="font-body-sm text-on-surface-variant mb-1" for="page-{rule.id}">Target Page</label>
                            <input 
                                id="page-{rule.id}"
                                type="number" 
                                min="1" 
                                max={totalPages}
                                class="w-24 bg-surface-container border border-outline rounded-lg px-3 py-2 font-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                                bind:value={rule.pageNumber}
                                placeholder="e.g. 5"
                                oninput={() => resultPdfUrl = null}
                            />
                        </div>

                        <div class="flex-grow flex flex-col w-full">
                            <span class="font-body-sm text-on-surface-variant mb-1">Replacement File (PDF/Image)</span>
                            {#if rule.file}
                                <div class="flex items-center gap-3 bg-surface-container px-4 py-2 rounded-lg border border-outline">
                                    {#if rule.file.type.startsWith('image/')}
                                        <FileImage class="text-primary flex-shrink-0" size={20} />
                                    {:else}
                                        <FileText class="text-primary flex-shrink-0" size={20} />
                                    {/if}
                                    <span class="font-body-md text-on-surface truncate flex-grow">{rule.file.name}</span>
                                    <button class="text-on-surface-variant hover:text-error transition-colors" onclick={() => handleRuleFile(rule.id, {target: {files: []}})}>
                                        <X size={20} />
                                    </button>
                                </div>
                            {:else}
                                <div class="relative w-full">
                                    <input 
                                        type="file" 
                                        accept="application/pdf,image/jpeg,image/png" 
                                        class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                                        onchange={(e) => handleRuleFile(rule.id, e)} 
                                    />
                                    <div class="w-full bg-surface-container border border-dashed border-outline-variant hover:border-primary transition-colors rounded-lg px-4 py-2 text-center text-on-surface-variant font-body-sm">
                                        Click to browse or drag file here
                                    </div>
                                </div>
                            {/if}
                        </div>

                        {#if rules.length > 1}
                            <button 
                                class="absolute top-4 right-4 sm:static text-on-surface-variant hover:text-error transition-colors p-2"
                                onclick={() => removeRule(rule.id)}
                                aria-label="Remove rule">
                                <X />
                            </button>
                        {/if}
                    </div>
                {/each}
            </div>

            <button 
                class="mt-4 flex items-center gap-2 text-primary hover:text-primary-container font-headline-sm transition-colors"
                onclick={addRule}>
                <Plus size={20} />
                Add Another Replacement
            </button>
        </div>

        {#if error || (validationState.msg && resultPdfUrl === null && !isProcessing && rules.some(r => r.pageNumber))}
            <div class="mt-6 mb-6 p-4 bg-error-container text-on-error-container rounded-lg font-body-md flex items-start gap-2">
                <AlertCircle class="" />
                <p>{error || validationState.msg}</p>
            </div>
        {/if}

        <div class="flex flex-col sm:flex-row gap-4 items-center mt-8 pt-8 border-t border-outline-variant">
            <button 
                class="w-full sm:w-auto bg-primary hover:bg-primary-container text-on-primary font-headline-md text-[18px] px-8 py-4 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 bento-hover"
                onclick={processReplacement}
                disabled={isProcessing || !validationState.valid}>
                {#if isProcessing}
                    <Loader2 class="animate-spin" style="animation: spin 1s linear infinite;" />
                    Processing...
                {:else}
                    <FileSymlink class="" />
                    Replace Pages
                {/if}
            </button>
            
            {#if resultPdfUrl}
                <a 
                    href={resultPdfUrl} 
                    download="replaced_{mainFile.name}"
                    class="w-full sm:w-auto bg-surface-container-high hover:bg-surface-variant text-on-surface font-headline-md text-[18px] px-8 py-4 rounded-full transition-all flex items-center justify-center gap-2 bento-hover">
                    <Download class="" />
                    Download PDF
                </a>
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
