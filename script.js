const SB_URL = 'https://mvsbrknkfwwptjifdqca.supabase.co';
const SB_KEY = 'sb_publishable_siHYnBPzrZSyHcx01nopsA_I4im8Ygr';
const _supabase = supabase.createClient(SB_URL, SB_KEY);

document.addEventListener('DOMContentLoaded', () => {
    const alphabet = "ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ".split("");
    const strip = document.getElementById('alphabetStrip');
    const sInp = document.getElementById('searchInput');

    // 1. Alfabe butonları
    if(strip) {
        alphabet.forEach(l => {
            const b = document.createElement('button');
            b.innerText = l; b.className = 'letter-btn';
            b.onclick = () => getByLetter(l);
            strip.appendChild(b);
        });
    }

    // 2. CANLI ARAMA PROTOKOLÜ (Tuşa basıldığı an çalışır)
    if(sInp) {
        sInp.addEventListener('input', (e) => {
            const val = e.target.value.trim();
            if (val.length >= 2) { // En az 2 harf yazınca aramaya başla (performans için)
                runSearch(val);
            } else if (val.length === 0) {
                document.getElementById('results').innerHTML = ''; // Silince temizle
            }
        });
    }
});

// Çift Yönlü Arama (Soru veya Cevap fark etmeksizin)
async function runSearch(q) {
    const { data, error } = await _supabase
        .from('kelimeler')
        .select('*')
        .or(`kelime.ilike.%${q}%,anlam.ilike.%${q}%`)
        .limit(20); // İlk 20 sonucu getir (hız için)

    if (error) console.error("Arama hatası:", error);
    render(data);
}

// Harf Filtresi (Sadece kelime baş harfine göre)
async function getByLetter(l) {
    const { data } = await _supabase.from('kelimeler')
        .select('*')
        .ilike('kelime', `${l}%`);
    render(data);
}

function render(data) {
    const res = document.getElementById('results');
    if(!res) return;
    res.innerHTML = '';

    if (!data || data.length === 0) {
        res.innerHTML = '<p style="text-align:center; padding:2rem; opacity:0.5;">Eşleşme bulunamadı...</p>';
        return;
    }

    data.forEach(item => {
        const d = document.createElement('div');
        d.className = 'word-card';
        d.innerHTML = `
            <div style="display:flex; flex-direction:column; gap:8px;">
                <div>
                    <small style="color:#64748b; font-weight:800; text-transform:uppercase; font-size:0.7rem;">Soru / Tanım</small>
                    <p style="margin:2px 0; font-size:1.05rem; color:#1e293b;">${item.anlam}</p>
                </div>
                <div style="border-top: 1px solid #f1f5f9; pt-2;">
                    <small style="color:#2563eb; font-weight:800; text-transform:uppercase; font-size:0.7rem;">Cevap</small>
                    <h2 style="margin:2px 0; letter-spacing:1px; color:#0f172a; font-size:1.4rem;">${item.kelime}</h2>
                </div>
            </div>
        `;
        res.appendChild(d);
    });
}
