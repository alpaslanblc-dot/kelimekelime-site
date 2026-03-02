const SB_URL = 'https://mvsbrknkfwwptjifdqca.supabase.co';
const SB_KEY = 'sb_publishable_siHYnBPzrZSyHcx01nopsA_I4im8Ygr';
const _supabase = supabase.createClient(SB_URL, SB_KEY);

document.addEventListener('DOMContentLoaded', () => {
    const alphabet = "ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ".split("");
    const strip = document.getElementById('alphabetStrip');
    const sInp = document.getElementById('searchInput');

    // 1. Alfabe butonlarını yeniden oluştur (Kaybolmaması için)
    if(strip) {
        strip.innerHTML = ''; // Temizle ve yeniden doldur
        alphabet.forEach(l => {
            const b = document.createElement('button');
            b.innerText = l; b.className = 'letter-btn';
            b.onclick = () => getByLetter(l);
            strip.appendChild(b);
        });
    }

    // 2. Canlı Arama
    if(sInp) {
        sInp.addEventListener('input', (e) => {
            const val = e.target.value.trim();
            if (val.length >= 2) {
                runSearch(val);
            } else if (val.length === 0) {
                const res = document.getElementById('results');
                if(res) res.innerHTML = '';
            }
        });
    }
});

// Çift Yönlü Arama
async function runSearch(q) {
    const { data, error } = await _supabase
        .from('kelimeler')
        .select('*')
        .or(`kelime.ilike.%${q}%,anlam.ilike.%${q}%`)
        .limit(20);

    if (error) console.error("Arama hatası:", error);
    render(data);
}

// Harf Filtresi
async function getByLetter(l) {
    const { data, error } = await _supabase.from('kelimeler')
        .select('*')
        .ilike('kelime', `${l}%`);
    
    if (error) console.error("Harf yükleme hatası:", error);
    render(data);
}

// Görselleştirme (Render) Fonksiyonu
function render(data) {
    const res = document.getElementById('results');
    if(!res) return;
    res.innerHTML = '';

    if (!data || data.length === 0) {
        res.innerHTML = '<p style="text-align:center; padding:2rem; opacity:0.5;">Eşleşme bulunamadı...</p>';
        return;
    }

    data.forEach(item => {
        // Kategori Renk Mantığı
        let catColor = '#f1f5f9'; // Varsayılan Gri
        let textColor = '#475569';
        const kategori = item.kategori || 'Genel';

        if (kategori.includes('Tıp')) { catColor = '#fee2e2'; textColor = '#991b1b'; }
        else if (kategori.includes('Mitoloji')) { catColor = '#fef3c7'; textColor = '#92400e'; }
        else if (kategori.includes('Denizcilik')) { catColor = '#e0f2fe'; textColor = '#0369a1'; }
        else if (kategori.includes('Tarih')) { catColor = '#f0fdf4'; textColor = '#166534'; }

        const d = document.createElement('div');
        d.className = 'word-card';
        d.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                <small style="color:#64748b; font-weight:800; text-transform:uppercase; font-size:0.65rem; letter-spacing:0.5px;">Soru / Tanım</small>
                <span style="background:${catColor}; color:${textColor}; padding:4px 10px; border-radius:6px; font-size:0.65rem; font-weight:700; text-transform:uppercase; border:1px solid rgba(0,0,0,0.05);">
                    ${kategori}
                </span>
            </div>
            <div style="display:flex; flex-direction:column; gap:8px;">
                <p style="margin:2px 0; font-size:1.05rem; color:#1e293b; line-height:1.5;">${item.anlam}</p>
                <div style="border-top: 1px solid #f1f5f9; padding-top:12px; margin-top:4px;">
                    <small style="color:#2563eb; font-weight:800; text-transform:uppercase; font-size:0.65rem; letter-spacing:0.5px;">Cevap</small>
                    <h2 style="margin:2px 0; letter-spacing:1.5px; color:#0f172a; font-size:1.5rem; font-weight:800;">${item.kelime}</h2>
                </div>
            </div>
        `;
        res.appendChild(d);
    });
}
