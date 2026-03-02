const SB_URL = 'https://mvsbrknkfwwptjifdqca.supabase.co';
const SB_KEY = 'sb_publishable_siHYnBPzrZSyHcx01nopsA_I4im8Ygr';
const _supabase = supabase.createClient(SB_URL, SB_KEY);

document.addEventListener('DOMContentLoaded', () => {
    const alphabet = "ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ".split("");
    const strip = document.getElementById('alphabetStrip');
    const sInp = document.getElementById('searchInput');

    // 1. Alfabe butonlarını oluştur
    if(strip) {
        strip.innerHTML = ''; 
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

async function runSearch(q) {
    const { data, error } = await _supabase
        .from('kelimeler')
        .select('*')
        .or(`kelime.ilike.%${q}%,anlam.ilike.%${q}%`)
        .limit(20);

    if (error) console.error("Hata:", error);
    render(data);
}

async function getByLetter(l) {
    const { data, error } = await _supabase.from('kelimeler')
        .select('*')
        .ilike('kelime', `${l}%`);
    
    if (error) console.error("Hata:", error);
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
        // Kategori varsa göster, 'Genel' ise veya boşsa gizle
        const hasCategory = item.kategori && item.kategori !== 'Genel' && item.kategori !== '';
        
        let badgeHTML = '';
        if (hasCategory) {
            let bgColor = '#f1f5f9';
            let txtColor = '#475569';
            
            // Renk atamaları
            if (item.kategori.includes('Tıp')) { bgColor = '#fee2e2'; txtColor = '#991b1b'; }
            else if (item.kategori.includes('Mitoloji')) { bgColor = '#fef3c7'; txtColor = '#92400e'; }
            else if (item.kategori.includes('Denizcilik')) { bgColor = '#e0f2fe'; txtColor = '#0369a1'; }

            badgeHTML = `<span style="background:${bgColor}; color:${txtColor}; padding:4px 10px; border-radius:6px; font-size:0.65rem; font-weight:700; text-transform:uppercase; border:1px solid rgba(0,0,0,0.05);">${item.kategori}</span>`;
        }

        const d = document.createElement('div');
        d.className = 'word-card';
        d.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                <small style="color:#64748b; font-weight:800; text-transform:uppercase; font-size:0.65rem; letter-spacing:0.5px;">Soru / Tanım</small>
                ${badgeHTML}
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
