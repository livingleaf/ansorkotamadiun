// Fetch activities from a published Google Sheet (CSV). Fallback to local data if fetch fails.

// Use the published CSV URL directly (no need to extract SHEET_ID/GID)
const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQMyPNk9QRGU6IWh1l6KirRWv4NfLd_DfLkV3LX60EzFrIGfdRTHtlzclmKJazG16DhqxGuORzPJt9T/pub?gid=0&single=true&output=csv';
 
// fallback local data (keamanan kalau fetch gagal)
let activities = [
    { id: 1, kegiatan: "Konferancab PAC Taman, Karto, Mangu", judul: "Konferancab Se-Kota Madiun", pj: "PAC", waktu: "2 Nov 2025 - Internal", keterangan: "Terlaksana", status: "terlaksana" },
    { id: 2, kegiatan: "Pengamanan Banser", judul: "Giat PAM Nataru", pj: "Satkorcab Banser", waktu: "Desember 2025", keterangan: "Pengamanan Nataru", status: "wacana" },
    // ... tetap ada entri lain sebagai cadangan ...
];

// utility: simple CSV parser (handles quoted fields)
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
                // double quote inside quoted field -> add a quote and skip next quote
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
        // trim surrounding quotes and whitespace
        rows.push(cols.map(c => (c || '').trim().replace(/^"(.*)"$/s, '$1')));
    }
    return rows;
}

// map CSV rows to activities objects (expects header row)
function csvToActivities(csvText) {
    const rows = parseCsv(csvText);
    if (rows.length === 0) return [];
    const header = rows[0].map(h => h.toLowerCase());
    const dataRows = rows.slice(1);
    const out = dataRows.map(r => {
        const obj = {};
        for (let i = 0; i < header.length; i++) {
            const key = header[i].replace(/\s+/g, '_'); // e.g. "Id" -> "id" or "PJ" -> "pj"
            obj[key] = r[i] !== undefined ? r[i] : '';
        }
        // normalize keys expected by the rest of the script
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
    return out.filter(a => a && a.judul); // filter invalid
}

// fetch CSV and populate activities, then render
async function loadActivitiesFromSheet() {
    try {
        const res = await fetch(SHEET_CSV_URL, { cache: 'no-cache' });
        if (!res.ok) throw new Error('fetch failed ' + res.status);
        const text = await res.text();
        const parsed = csvToActivities(text);
        if (parsed && parsed.length) {
            activities = parsed;
            console.info('Loaded activities from Google Sheet:', activities.length);
        } else {
            console.warn('Sheet parsed but no rows found — using fallback activities.');
        }
    } catch (err) {
        console.warn('Could not load sheet, using fallback activities. Error:', err);
    } finally {
        // after activities set (either fetched or fallback), render UI
        if (typeof renderTimeline === 'function') renderTimeline();
        if (typeof renderDetails === 'function') renderDetails();
    }
}

// Option: if you prefer Google Sheets API (values endpoint) use code like below instead.
// Requires API key and the sheet range/name. Example URL:
// const API_KEY = 'YOUR_API_KEY';
// const RANGE = 'Sheet1!A:F'; // or just 'Sheet1'
// const SHEETS_API_URL = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(RANGE)}?key=${API_KEY}`;
// fetch(SHEETS_API_URL).then(...).catch(...)

// Start loading right away
document.addEventListener('DOMContentLoaded', () => {
    loadActivitiesFromSheet();
    // keep calling render if you want immediate fallback rendering before fetch resolves:
    if (typeof renderTimeline === 'function') renderTimeline();
    if (typeof renderDetails === 'function') renderDetails();
});