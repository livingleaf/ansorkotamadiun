<script>
    import '../../../app.css';
    import { onMount } from 'svelte';
    import { LoaderCircle, CheckCircle2, Clock, ArrowLeft, ArrowRight, Search } from '@lucide/svelte';

    const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQMyPNk9QRGU6IWh1l6KirRWv4NfLd_DfLkV3LX60EzFrIGfdRTHtlzclmKJazG16DhqxGuORzPJt9T/pub?gid=0&single=true&output=csv';

    let activities = $state([
        { id: 1, kegiatan: "Konferancab PAC Taman, Karto, Mangu", judul: "Konferancab Se-Kota Madiun", pj: "PAC", waktu: "2 Nov 2025 - Internal", keterangan: "Terlaksana", status: "terlaksana" },
        { id: 2, kegiatan: "Pengamanan Banser", judul: "Giat PAM Nataru", pj: "Satkorcab Banser", waktu: "Desember 2025", keterangan: "Pengamanan Nataru", status: "wacana" },
    ]);

    let filterStatus = $state('semua');
    let searchQuery = $state('');
    let currentDetailPage = $state(1);
    let isLoading = $state(true);
    const itemsPerPage = 5;

    function parseCsv(text) {
        const rows = [];
        const lines = text.replace(/\r\n/g, '\n').split('\n');
        for (let line of lines) {
            if (line === '') continue;
            const cols = [];
            let cur = '';
            let inQuotes = false;
            for (let i = 0; i < line.length; i++) {
                const ch = line[i];
                if (ch === '"') {
                    if (inQuotes && line[i + 1] === '"') {
                        cur += '"';
                        i++;
                    } else {
                        inQuotes = !inQuotes;
                    }
                } else if (ch === ',' && !inQuotes) {
                    cols.push(cur);
                    cur = '';
                } else {
                    cur += ch;
                }
            }
            cols.push(cur);
            rows.push(cols.map(c => (c || '').trim().replace(/^"(.*)"$/s, '$1')));
        }
        return rows;
    }

    function csvToActivities(csvText) {
        const rows = parseCsv(csvText);
        if (rows.length === 0) return [];
        const header = rows[0].map(h => h.toLowerCase());
        const dataRows = rows.slice(1);
        const out = dataRows.map(r => {
            const obj = {};
            for (let i = 0; i < header.length; i++) {
                const key = header[i].replace(/\s+/g, '_');
                obj[key] = r[i] !== undefined ? r[i] : '';
            }
            return {
                id: obj.id ? Number(obj.id) : (obj.ID ? Number(obj.ID) : undefined),
                kegiatan: obj.kegiatan || obj.activity || obj.kegiatan || '',
                judul: obj.judul || obj.title || obj.judul || '',
                pj: obj.pj || obj.pj_penanggungjawab || obj.pj || '',
                waktu: obj.waktu || obj.time || obj.waktu || '',
                keterangan: obj.keterangan || obj.notes || obj.keterangan || '',
                status: (obj.status || '').toLowerCase() || 'wacana'
            };
        });
        return out.filter(a => a && a.judul);
    }

    onMount(async () => {
        try {
            const res = await fetch(SHEET_CSV_URL, { cache: 'no-cache' });
            if (res.ok) {
                const text = await res.text();
                const parsed = csvToActivities(text);
                if (parsed && parsed.length) {
                    activities = parsed;
                }
            }
        } catch (err) {
            console.warn('Could not load sheet, using fallback activities. Error:', err);
        } finally {
            isLoading = false;
        }

        const handleScroll = () => {
            const navbar = document.querySelector('.navbar');
            if (navbar) {
                if (window.scrollY > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    });

    function parseWaktuDate(waktuStr) {
        if (!waktuStr) return new Date(9999, 0, 0);
        const matches = waktuStr.match(/(\d{1,2})\s+(\w+)\s+(\d{4})/);
        if (matches) {
            const monthMap = { 'jan': 0, 'peb': 1, 'feb': 1, 'maret': 2, 'mar': 2, 'april': 3, 'apr': 3, 'mei': 4, 'may': 4, 'juni': 5, 'jun': 5, 'juli': 6, 'jul': 6, 'agustus': 7, 'agu': 7, 'sept': 8, 'sep': 8, 'oktober': 9, 'okt': 9, 'november': 10, 'nov': 10, 'desember': 11, 'des': 11 };
            const day = parseInt(matches[1]);
            const month = monthMap[matches[2].toLowerCase()] || 0;
            const year = parseInt(matches[3]);
            return new Date(year, month, day);
        }
        return new Date(9999, 0, 0);
    }

    function getPjFlags(pj) {
        const pjText = (pj || '').toLowerCase();
        const flags = [];
        if (pjText.includes('banser')) flags.push({ bgClass: 'bg-gradient-to-br from-red-500 to-orange-400', txt: 'Banser' });
        if (pjText.includes('mdsra') || pjText.includes('mdra') || pjText.includes('mds ra') || pjText.includes('md ra')) flags.push({ bgClass: 'bg-gradient-to-br from-green-600 to-emerald-600', txt: 'MDSRA' });
        if (pjText.includes('badan siber') || pjText.includes('bsa') || pjText.includes('badan siber ansor')) flags.push({ bgClass: 'bg-gradient-to-br from-purple-600 to-purple-400', txt: 'Siber' });
        if (pjText.includes('kader') || pjText.includes('kaderisasi')) flags.push({ bgClass: 'bg-gradient-to-br from-cyan-600 to-cyan-500', txt: 'Kaderisasi' });
        return flags;
    }

    let sortedActivities = $derived(
        activities
            .filter(a => filterStatus === 'semua' ? true : a.status === filterStatus)
            .filter(a => {
                if (!searchQuery) return true;
                const lowerQuery = searchQuery.toLowerCase();
                return (a.judul?.toLowerCase() || '').includes(lowerQuery) || 
                       (a.kegiatan?.toLowerCase() || '').includes(lowerQuery) ||
                       (a.pj?.toLowerCase() || '').includes(lowerQuery) ||
                       (a.keterangan?.toLowerCase() || '').includes(lowerQuery);
            })
            .sort((a, b) => parseWaktuDate(a.waktu) - parseWaktuDate(b.waktu))
    );
        
    let totalPages = $derived(Math.ceil(sortedActivities.length / itemsPerPage) || 1);
    
    $effect(() => {
        if (currentDetailPage > totalPages) {
            currentDetailPage = 1;
        }
    });

    let paginatedActivities = $derived(
        sortedActivities.slice((currentDetailPage - 1) * itemsPerPage, currentDetailPage * itemsPerPage)
    );

    function setFilter(status) {
        filterStatus = status;
        currentDetailPage = 1;
    }
</script>

<svelte:head>
    <title>Detail Program Kerja GP Ansor</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
</svelte:head>

<style>
    :global(body) {
        font-family: 'Poppins', sans-serif;
    }
</style>

<div class="mt-10 w-[calc(100%-20px)] md:w-[calc(100%-24px)] lg:w-[calc(100%-40px)] max-w-[1080px] mx-auto relative min-h-[480px] bg-gradient-to-br from-emerald-600 via-emerald-500 to-emerald-400 shadow-[0_20px_60px_rgba(0,0,0,0.3)] rounded-[14px] lg:rounded-[20px] p-[20px_12px] md:p-[28px_18px] lg:p-[50px_45px]" id="page2">
    <div class="text-center mb-12 relative flex flex-col justify-center items-center">
        <div class="w-[64px] h-[64px] md:w-[80px] md:h-[80px] lg:w-[110px] lg:h-[110px] bg-white/95 rounded-full mx-auto mb-4 flex items-center justify-center border-[5px] border-white/30 px-2 md:px-3 b-2 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] hover:border-white/60 active:scale-95 cursor-pointer" onclick={() => window.location.href='/'} onkeydown={(e) => e.key === 'Enter' && (window.location.href='/')} tabindex="0" role="button">
            <img src="https://upload.wikimedia.org/wikipedia/id/thumb/7/70/Logo_GP_Ansor.png/250px-Logo_GP_Ansor.png" alt="Logo GP Ansor" class="w-full h-full object-contain">
        </div>
        <a href="/" class="text-white font-semibold cursor-pointer transition-opacity hover:opacity-80 flex items-center" aria-label="Kembali ke Beranda">
            <ArrowLeft class="w-5 h-5 mr-1" /> <span class="hidden md:inline">Home</span>
        </a>
        <h1 class="text-white text-[20px] md:text-[28px] lg:text-[44px] font-[800] mb-2.5 uppercase tracking-[2px] drop-shadow-[2px_2px_10px_rgba(0,0,0,0.3)]">Detail Program</h1>
        <p class="text-white/90 text-[13px] md:text-[16px] lg:text-[22px] font-light">Rincian Lengkap Kegiatan</p>
    </div>

    <div class="flex flex-col sm:flex-row justify-center gap-2 sm:gap-3 mb-6 bg-white/15 p-2 rounded-[20px] backdrop-blur-md">
        {#each ['semua', 'terlaksana', 'wacana'] as status}
            <button class="flex-1 py-3 px-6 rounded-[15px] font-semibold text-[14px] lg:text-[15px] cursor-pointer transition-all duration-300 {filterStatus === status ? 'bg-white text-emerald-600 shadow-[0_4px_15px_rgba(0,0,0,0.2)]' : 'bg-white/30 text-white hover:bg-white/50 hover:-translate-y-0.5'}" onclick={() => setFilter(status)}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
        {/each}
    </div>

    <div class="mb-6 relative">
        <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search class="w-5 h-5 text-white/70" />
        </div>
        <input 
            type="text" 
            bind:value={searchQuery}
            oninput={() => currentDetailPage = 1}
            placeholder="Cari program, judul, atau PJ..." 
            class="w-full bg-white/15 border border-white/30 text-white placeholder-white/70 text-[14px] lg:text-[15px] rounded-[15px] pl-11 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/20 transition-all backdrop-blur-md"
        />
    </div>

    <div class="flex flex-col gap-3.5 lg:gap-5 max-h-[500px] overflow-y-auto" id="detail-list">
        {#if isLoading}
            <div class="text-center p-10 col-span-full">
                <LoaderCircle class="animate-spin text-white w-12 h-12 mx-auto" />
                <p class="mt-4 text-white">Memuat data program kerja...</p>
            </div>
        {:else if paginatedActivities.length === 0}
            <div class="text-center p-10 col-span-full text-white/80">
                Tidak ada data program kerja untuk status ini.
            </div>
        {:else}
            {#each paginatedActivities as act (act.id || act.judul)}
            <div class="bg-white/95 rounded-[20px] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.15)] transition-all duration-300">
                <div class="flex items-center gap-3 mb-3 pb-3 border-b-[3px] border-emerald-500 relative">
                    <div class="bg-gradient-to-br from-emerald-600 to-emerald-500 text-white font-extrabold text-[16px] lg:text-[20px] w-[36px] h-[36px] lg:w-[45px] lg:h-[45px] rounded-[15px] flex items-center justify-center shrink-0">
                        {act.id || '-'}
                    </div>
                    <div class="flex-1 pr-16 md:pr-0">
                        <h3 class="text-[15px] md:text-[16px] lg:text-[17px] font-bold text-slate-800 mb-1">{act.judul}</h3>
                        <p class="text-[12px] lg:text-[13px] text-slate-500 font-medium">{act.kegiatan}</p>
                    </div>
                    {#if getPjFlags(act.pj).length > 0}
                        <div class="absolute right-0 top-0 md:static flex flex-wrap gap-1.5 justify-end">
                            {#each getPjFlags(act.pj) as flag}
                                <div class="px-2 py-1 lg:px-2.5 lg:py-1.5 rounded-lg text-white font-bold text-[10px] lg:text-[12px] uppercase tracking-[.6px] shadow-[0_6px_18px_rgba(0,0,0,0.12)] {flag.bgClass}">{flag.txt}</div>
                            {/each}
                        </div>
                    {/if}
                </div>
                <div class="grid gap-2.5">
                    <div class="flex gap-2.5 items-start">
                        <div class="font-bold text-emerald-600 text-[12px] lg:text-[13px] min-w-[70px] md:min-w-[80px] lg:min-w-[90px]">PJ</div>
                        <div class="text-slate-800 text-[13px] leading-relaxed flex-1">: {act.pj}</div>
                    </div>
                    <div class="flex gap-2.5 items-start">
                        <div class="font-bold text-emerald-600 text-[12px] lg:text-[13px] min-w-[70px] md:min-w-[80px] lg:min-w-[90px]">Waktu</div>
                        <div class="text-slate-800 text-[13px] leading-relaxed flex-1">: {act.waktu}</div>
                    </div>
                    <div class="flex gap-2.5 items-start">
                        <div class="font-bold text-emerald-600 text-[12px] lg:text-[13px] min-w-[70px] md:min-w-[80px] lg:min-w-[90px]">Keterangan</div>
                        <div class="text-slate-800 text-[13px] leading-relaxed flex-1">: {act.keterangan || '-'}</div>
                    </div>
                    <div>
                        <span class="inline-flex items-center gap-1.5 px-[14px] py-[5px] rounded-full text-[12px] font-semibold mt-1.5 {act.status === 'terlaksana' ? 'bg-emerald-500 text-white' : 'bg-amber-400 text-white'}">
                            {#if act.status === 'terlaksana'}
                                <CheckCircle2 class="w-3.5 h-3.5" /> Terlaksana
                            {:else}
                                <Clock class="w-3.5 h-3.5" /> Belum
                            {/if}
                        </span>
                    </div>
                </div>
            </div>
            {/each}
        {/if}
    </div>

    {#if !isLoading && sortedActivities.length > itemsPerPage}
        <div class="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-[15px] p-[15px] sm:py-[25px] sm:px-0 bg-white/10 rounded-[15px] mt-[30px]">
            <button 
                class="w-full sm:w-auto inline-flex justify-center items-center gap-2 px-4 py-2.5 sm:px-[24px] sm:py-[12px] border-2 border-white/50 bg-white/15 text-white rounded-[12px] font-semibold text-[12px] sm:text-[14px] backdrop-blur-md transition-all hover:bg-white/30 hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0" 
                onclick={() => currentDetailPage--} 
                disabled={currentDetailPage === 1}>
                <ArrowLeft class="w-4 h-4" /> Sebelumnya
            </button>
            
            <span class="text-white/95 font-semibold text-[13px] sm:text-[15px] mx-1 sm:mx-5">Halaman {currentDetailPage} dari {totalPages}</span>
            
            <button 
                class="w-full sm:w-auto inline-flex justify-center items-center gap-2 px-4 py-2.5 sm:px-[24px] sm:py-[12px] border-2 border-white/50 bg-white/15 text-white rounded-[12px] font-semibold text-[12px] sm:text-[14px] backdrop-blur-md transition-all hover:bg-white/30 hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0" 
                onclick={() => currentDetailPage++} 
                disabled={currentDetailPage === totalPages}>
                Selanjutnya <ArrowRight class="w-4 h-4" />
            </button>
        </div>
    {/if}

    <div class="mt-5 text-center text-white text-[13px] font-light">
        © 2025 GP Ansor Kota Madiun
    </div>
</div>
