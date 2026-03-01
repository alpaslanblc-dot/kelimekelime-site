// 1. BAĞLANTI (Kendi bilgilerini yapıştır)
const SB_URL = 'https://mvsbrknkfwwptjifdqca.supabase.co';
const SB_KEY = 'sb_publishable_siHYnBPzrZSyHcx01nopsA_I4im8Ygr';

const _supabase = supabase.createClient(SB_URL, SB_KEY);

document.addEventListener('DOMContentLoaded', () => {
    const alphabet = "ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ".split("");
    const strip = document.getElementById('alphabetStrip');
    if(strip) {
        alphabet.forEach(l => {
            const b = document.createElement('button');
            b.innerText = l;
            b.className = 'letter-btn';
            b.onclick = () => getByLetter(l);
            strip.appendChild(b);
        });
    }

    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    if(searchBtn && searchInput) {
        searchBtn.onclick = () => search(searchInput.value);
        searchInput.onkeypress = (e) => { if (e.key === 'Enter') search(e.target.value); };
    }
});

// 2. ÇİFT YÖNLÜ ARAMA FONKSİYONU
async function search(q) {
    if(!q) return;

    // Sistem hem 'kelime' sütununda hem de 'anlam' sütununda aynı anda arama yapar
    const { data, error } = await _supabase
        .from('kelimeler')
        .select('*')
        .or(`kelime.ilike.%${q}%,anlam.ilike.%${q}%`); // KRİTİK NOKTA: Burası çift yönlü arama yapar

    if (error) console.error("Arama hatası:", error);
    render(data);
}

async function getByLetter(l) {
    const { data } = await _supabase.from('kelimeler').select('*').ilike('kelime', `${l}%`);
    render(data);
}

// 3. EKRANA BASMA
function render(data) {
    const res = document.getElementById('results');
    if(!res) return;
    res.innerHTML = '';

    if (!data || data.length === 0) {
        res.innerHTML = '<p style="text-align:center; opacity:0.6; padding:2rem;">Bulmaca cevabı bulunamadı.</p>';
        return;
    }

    data.forEach(item => {
        const d = document.createElement('div');
        d.className = 'word-card';
        
        // Görünümü bulmaca formatına uygun yapalım: Cevap büyük, Soru küçük
        d.innerHTML = `
            <div style="font-size: 0.8rem; color: #64748b; margin-bottom: 5px;">SORU / TANIM:</div>
            <p style="margin: 0 0 10px 0; font-weight: 500;">${item.anlam || item.tanım || "Açıklama yok"}</p>
            <div style="font-size: 0.8rem; color: #2563eb; font-weight: 800; border-top: 1px dashed #e2e8f0; pt-2;">CEVAP:</div>
            <h2 style="margin: 5px 0 0 0; color: #1e293b; letter-spacing: 2px;">${item.kelime}</h2>
        `;
        res.appendChild(d);
    });
}
