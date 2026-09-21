<script>
    import '../../app.css';
    import { onMount } from 'svelte';
    import { ArrowLeft, ExternalLink, MessageSquare, ShieldCheck } from '@lucide/svelte';

    let isIframeLoading = $state(true);

    const GOOGLE_FORM_EMBED_URL = "https://docs.google.com/forms/d/e/1FAIpQLSdwOgkRi4Ul-zQz0ZkaLsZP4J2znOgiisvdsia4ajqQw4HTag/viewform?embedded=true";
    const GOOGLE_FORM_DIRECT_URL = "https://docs.google.com/forms/d/e/1FAIpQLSdwOgkRi4Ul-zQz0ZkaLsZP4J2znOgiisvdsia4ajqQw4HTag/viewform";
    const WA_HELP_URL = "https://wa.me/6281234567890?text=Assalamu%27alaikum%20Panitia%20Diklatsar%20Banser%20Kota%20Madiun%2C%20saya%20ingin%20bertanya%20seputar%20pendaftaran%20Diklatsar.";

    function handleIframeLoad() {
        isIframeLoading = false;
    }

    onMount(() => {
        // Fallback: hide loading indicator after 3.5s if onload doesn't fire
        const timer = setTimeout(() => {
            isIframeLoading = false;
        }, 3500);

        return () => clearTimeout(timer);
    });
</script>

<svelte:head>
    <title>Formulir Pendaftaran Diklatsar Banser 2026 - GP Ansor Kota Madiun</title>
    <meta name="description" content="Formulir pendaftaran resmi calon peserta Diklatsar Banser PC GP Ansor Kota Madiun 2026." />
    <meta property="og:title" content="Formulir Pendaftaran Diklatsar Banser 2026 - GP Ansor Kota Madiun" />
    <meta property="og:description" content="Pendaftaran Calon Peserta Diklatsar Banser 2026 Satkorcab Kota Madiun." />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet">
</svelte:head>

<div class="min-h-screen bg-[#071c11] text-[#f4f7f4] font-['Poppins',sans-serif] flex flex-col justify-between py-6 px-3 sm:px-6">
    
    <!-- TOP BAR -->
    <header class="max-w-3xl w-full mx-auto mb-6 flex items-center justify-between">
        <a 
            href="/" 
            class="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs sm:text-sm font-semibold border border-white/10 transition backdrop-blur-md"
            aria-label="Kembali ke Beranda">
            <ArrowLeft class="w-4 h-4 text-emerald-400" />
            <span>Kembali ke Beranda</span>
        </a>

        <div class="flex items-center gap-2">
            <a 
                href={GOOGLE_FORM_DIRECT_URL} 
                target="_blank" 
                rel="noopener noreferrer" 
                class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-700/60 hover:bg-emerald-600 text-white text-xs sm:text-sm font-semibold border border-emerald-500/40 transition"
                title="Buka form langsung di Google Forms">
                <ExternalLink class="w-4 h-4" />
                <span class="hidden sm:inline">Buka di Tab Baru</span>
            </a>
        </div>
    </header>

    <!-- FORM CARD CONTAINER -->
    <main class="max-w-3xl w-full mx-auto flex-1 flex flex-col">
        <div class="rounded-2xl sm:rounded-3xl bg-[#0c2718] border border-emerald-700/60 shadow-[0_20px_60px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col flex-1">
            
            <!-- HEADER -->
            <div class="bg-gradient-to-r from-emerald-800 via-emerald-700 to-green-800 px-5 py-5 sm:px-8 sm:py-6 text-white border-b border-emerald-600/40">
                <div class="flex items-center gap-3 sm:gap-4">
                    <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white p-1.5 flex items-center justify-center shrink-0 shadow-md">
                        <img src="/assets/image/Banser merah.png" alt="Logo Banser" class="w-full h-full object-contain" />
                    </div>
                    <div class="flex-1 min-w-0">
                        <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/20 text-emerald-200 text-[10px] sm:text-xs font-semibold mb-1">
                            <ShieldCheck class="w-3 h-3 text-amber-300" />
                            <span>Satkorcab Banser Kota Madiun</span>
                        </div>
                        <h1 class="font-extrabold text-base sm:text-xl md:text-2xl text-white truncate">
                            Pendaftaran Diklatsar Banser
                        </h1>
                        <p class="text-xs sm:text-sm text-emerald-100/90 truncate">
                            Calon Peserta Diklatsar Banser 2026
                        </p>
                    </div>
                </div>
            </div>

            <!-- INSTRUCTION STRIP -->
            <div class="bg-[#082013] px-5 py-3 sm:px-8 border-b border-emerald-800/60 flex items-center justify-between text-xs text-slate-300 gap-2">
                <span>Silakan lengkapi data Nama dan Kontak WhatsApp Anda di bawah ini:</span>
                <span class="text-emerald-400 font-bold shrink-0">Wajib Diisi *</span>
            </div>

            <!-- EMBEDDED GOOGLE FORM -->
            <div class="relative w-full bg-white flex-1 min-h-[640px] sm:min-h-[720px]">
                {#if isIframeLoading}
                    <div class="absolute inset-0 z-20 bg-slate-900/95 flex flex-col items-center justify-center p-6 text-center">
                        <div class="w-10 h-10 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin mb-3"></div>
                        <p class="text-white font-semibold text-sm">Memuat formulir pendaftaran...</p>
                        <p class="text-slate-400 text-xs mt-1">Menghubungkan ke Google Forms</p>
                    </div>
                {/if}

                <iframe 
                    src={GOOGLE_FORM_EMBED_URL}
                    onload={handleIframeLoad}
                    title="Pendaftaran Calon Peserta Diklatsar Banser"
                    width="100%" 
                    height="720"
                    class="w-full h-full min-h-[640px] sm:min-h-[720px] border-0 block"
                    loading="lazy"
                >
                    Memuat formulir pendaftaran…
                </iframe>
            </div>

            <!-- HELPER FOOTER -->
            <div class="p-4 sm:px-8 bg-[#082013] border-t border-emerald-800/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <span class="text-slate-400 text-center sm:text-left">
                    Ada kendala saat mengisi formulir?
                </span>
                <a 
                    href={WA_HELP_URL} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    class="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-semibold transition">
                    <MessageSquare class="w-4 h-4" />
                    <span>Hubungi Panitia via WhatsApp</span>
                </a>
            </div>

        </div>
    </main>

    <!-- FOOTER -->
    <footer class="max-w-3xl w-full mx-auto mt-6 text-center text-xs text-slate-500">
        &copy; 2026 Satkorcab Banser PC GP Ansor Kota Madiun. All rights reserved.
    </footer>

</div>
