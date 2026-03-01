const SB_URL = 'https://mvsbrknkfwwptjifdqca.supabase.co';
const SB_KEY = 'sb_publishable_siHYnBPzrZSyHcx01nopsA_I4im8Ygr';
const _supabase = supabase.createClient(SB_URL, SB_KEY);

document.addEventListener('DOMContentLoaded', () => {
    // Harf butonları
    const alphabet = "ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ".split("");
    const strip = document.getElementById('alphabetStrip');
    if(strip) {
        alphabet.forEach(l => {
            const b = document.createElement('button');
            b.innerText = l; b.className = 'letter-btn';
            b.onclick = () => getByLetter(l);
            strip.appendChild(b);
        });
    }
    // Arama
    const sBtn = document.getElementById('searchBtn');
    const sInp = document.getElementById('searchInput');
    if(sBtn && sInp) {
        sBtn.onclick = () => runSearch(sInp.value);
        sInp.onkeypress = (e) => { if (e.key === 'Enter') runSearch(e.target.value); };
    }
});

async function runSearch(q) {
    if(!q) return;
    // Hem kelimede hem anlamda ara, tekrarları engelle
    const { data } = await _supabase.from('kelimeler').select('*')
        .or(`kelime.ilike.%${q}%,anlam.ilike.%${q}%`);
    render(data);
}

async function getByLetter(l) {
    const { data } = await _supabase.from('kelimeler').select('*').ilike('kelime', `${l}%`);
    render(data);
}

function render(data) {
    const res = document.getElementById('results');
    res.innerHTML = '';
    if (!data || data.length === 0) {
        res.innerHTML = '<p style="text-align:center; padding:2rem;">Sonuç bulunamadı.</p>';
        return;
    }
    data.forEach(item => {
        const d = document.createElement('div');
        d.className = 'word-card';
        d.innerHTML = `
            <small style="color:#64748b; font-weight:bold;">SORU:</small>
            <p style="margin:5px 0 15px 0; font-size:1.1rem;">${item.anlam}</p>
            <small style="color:#2563eb; font-weight:bold;">CEVAP:</small>
            <h2 style="margin:5px 0 0 0; letter-spacing:2px; color:#1e293b;">${item.kelime}</h2>
        `;
        res.appendChild(d);
    });
}
