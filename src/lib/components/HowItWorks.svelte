<script>
    import { FileUp, HelpCircle, Download } from '@lucide/svelte';
</script>

<section class="bg-surface-container-low py-20 mt-stack-lg" id="how-it-works">
    <div class="max-w-container-max mx-auto px-gutter">
        <div class="text-center mb-16">
            <h2 class="font-display text-headline-lg text-on-surface mb-4">How It Works</h2>
            <p class="font-body-lg text-body-lg text-on-surface-variant">Three simple steps to manage your documents without compromising privacy.</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-stack-lg relative">
            <div class="flex flex-col items-center text-center relative z-10">
                <div class="w-20 h-20 bg-surface-container-lowest rounded-full flex items-center justify-center shadow-md mb-6 border border-outline-variant">
                    <FileUp class="text-primary text-3xl" />
                </div>
                <h4 class="font-headline-md text-headline-md text-on-surface mb-2">1. Select Files</h4>
                <p class="font-body-md text-body-md text-on-surface-variant">Drag and drop your PDFs into the browser tool area.</p>
            </div>
            <div class="flex flex-col items-center text-center relative z-10">
                <div class="w-20 h-20 bg-primary text-on-primary rounded-full flex items-center justify-center shadow-lg mb-6 border-4 border-surface-container-low">
                    <HelpCircle class="text-3xl" style="font-variation-settings: 'FILL' 1;" />
                </div>
                <h4 class="font-headline-md text-headline-md text-on-surface mb-2">2. Process Locally</h4>
                <p class="font-body-md text-body-md text-on-surface-variant">Your browser does the heavy lifting. No data is uploaded to our servers.</p>
            </div>
            <div class="flex flex-col items-center text-center relative z-10">
                <div class="w-20 h-20 bg-surface-container-lowest rounded-full flex items-center justify-center shadow-md mb-6 border border-outline-variant">
                    <Download class="text-primary text-3xl" />
                </div>
                <h4 class="font-headline-md text-headline-md text-on-surface mb-2">3. Download</h4>
                <p class="font-body-md text-body-md text-on-surface-variant">Instantly save your modified secure files back to your device.</p>
            </div>
        </div>
    </div>
</section>
