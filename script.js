// BURAYI KENDİ BİLGİLERİNLE DOLDUR
const SB_URL = 'https://BURAYA_SENIN_URL.supabase.co';
const SB_KEY = 'BURAYA_SENIN_ANON_KEY';

const _supabase = supabase.createClient(SB_URL, SB_KEY);

document.addEventListener('DOMContentLoaded', () => {
    // Alfabe butonlarını diz
    const alphabet = "ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ".split("");
    const strip = document.getElementById('alphabetStrip');
    alphabet.forEach(l => {
        const b = document.createElement('button');
        b.innerText = l;
        b.className = 'letter-btn';
        b.onclick = () => getByLetter(l);
        strip.appendChild(b);
    });

    // Arama butonu
    document.getElementById('searchBtn').onclick = () => {
        const val = document.getElementById('searchInput').value;
        search(val);
    };

    // Enter tuşu
    document.getElementById('searchInput').onkeypress = (e) => {
        if (e.key === 'Enter') search(e.target.value);
    };
});

async function search(q) {
    if(!q) return;
    const { data } = await _supabase.from('kelimeler').select('*').ilike('kelime', `%${q}%`);
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
        res.innerHTML = '<p style="text-align:center; opacity:0.6;">Sonuç bulunamadı.</p>';
        return;
    }
    data.forEach(item => {
        const d = document.createElement('div');
        d.className = 'word-card';
        d.innerHTML = `<h2>${item.kelime}</h2><p>${item.tanim}</p>`;
        res.appendChild(d);
    });
}
