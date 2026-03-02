const SB_URL = 'https://mvsbrknkfwwptjifdqca.supabase.co';
const SB_KEY = 'sb_publishable_siHYnBPzrZSyHcx01nopsA_I4im8Ygr';
const _supabase = supabase.createClient(SB_URL, SB_KEY);

// Butonları ve arama dinleyicilerini başlatan ana fonksiyon
function setupSite() {
    const alphabet = "ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ".split("");
    const strip = document.getElementById('alphabetStrip');
    const sInp = document.getElementById('searchInput');

    // Alfabe butonlarını oluştur
    if(strip) {
        strip.innerHTML = ''; 
        alphabet.forEach(l => {
            const b = document.createElement('button');
            b.innerText = l; 
            b.className = 'letter-btn';
            b.onclick = () => getByLetter(l);
            strip.appendChild(b);
        });
    }

    // Arama kutusuna yazıldığında çalışacak tetikleyici
    if(sInp) {
        sInp.addEventListener('input', (e) => {
            const val = e.target.value.trim();
            if (val.length >= 2) runSearch(val);
            else if (val.length === 0) {
                const res = document.getElementById('results');
                if(res) res.innerHTML = '';
            }
        });
    }
}

async function runSearch(q) {
    const { data } = await _supabase.from('kelimeler').select('*')
        .or(`kelime.ilike.%${q}%,anlam.ilike.%${q}%`).limit(25);
    render(data);
}

async function getByLetter(l) {
    const { data } = await _supabase.from('kelimeler').select('*').ilike('kelime', `${l}%`).order('kelime', { ascending: true });
    render(data);
}

function render(data) {
    const res = document.getElementById('results');
    if(!res) return;
    res.innerHTML = '';

    if (!data || data.length === 0) {
        res.innerHTML = '<div style="text-align:center; padding:4rem; opacity:0.4; font-weight:600;">Sonuç bulunamadı...</div>';
        return;
    }

    data.forEach(item => {
        const hasCat = item.kategori && item.kategori !== 'Genel' && item.kategori !== '';
        let bg = '#f1f5f9', tx = '#475569';
        
        if(hasCat) {
            if(item.kategori.includes('Tıp')) { bg='#fee2e2'; tx='#991b1b'; }
            else if(item.kategori.includes('Mitoloji')) { bg='#fef3c7'; tx='#92400e'; }
            else if(item.kategori.includes('Denizcilik')) { bg='#e0f2fe'; tx='#0369a1'; }
            else if(item.kategori.includes('Tarih')) { bg='#f0fdf4'; tx='#166534'; }
        }

        const d = document.createElement('div');
        d.className = 'word-card';
        d.innerHTML = `
            <div class="card-header">
                <span class="label">Soru / Tanım</span>
                ${hasCat ? `<span class="cat-badge" style="background:${bg}; color:${tx};">${item.kategori}</span>` : ''}
            </div>
            <p>${item.anlam}</p>
            <div class="answer-section">
                <span class="label" style="color:var(--primary)">Cevap</span>
                <h2>${item.kelime}</h2>
            </div>
        `;
        res.appendChild(d);
    });
}

// Sayfa tamamen yüklendiğinde butonları oluştur
window.onload = setupSite;
