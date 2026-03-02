const SB_URL = 'https://mvsbrknkfwwptjifdqca.supabase.co';
const SB_KEY = 'sb_publishable_siHYnBPzrZSyHcx01nopsA_I4im8Ygr';
const _supabase = supabase.createClient(SB_URL, SB_KEY);

// Sayfa yüklendiğinde her şeyi başlat
async function setupSite() {
    initAlphabet();
    await loadCategories(); // Kategorileri otomatik çek
    initSearch();
}

// 1. Alfabe Butonlarını Başlat
function initAlphabet() {
    const alphabet = "ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ".split("");
    const strip = document.getElementById('alphabetStrip');
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
}

// 2. Kategorileri Veritabanından Otomatik Çek ve Listele
async function loadCategories() {
    const catStrip = document.getElementById('categoryStrip');
    if (!catStrip) return;

    // Sadece kategorisi olan verileri çek
    const { data, error } = await _supabase
        .from('kelimeler')
        .select('kategori')
        .not('kategori', 'is', null);

    if (error) return;

    // Benzersiz kategorileri bul (Genel hariç)
    const uniqueCats = [...new Set(data.map(item => item.kategori))]
        .filter(c => c && c !== 'Genel' && c !== '');

    catStrip.innerHTML = '';
    uniqueCats.forEach(cat => {
        const btn = document.createElement('button');
        btn.innerText = cat;
        btn.className = 'cat-btn';
        btn.onclick = () => filterByCategory(cat);
        catStrip.appendChild(btn);
    });
}

// 3. Arama Kutusu İşlemleri
function initSearch() {
    const sInp = document.getElementById('searchInput');
    const sBtn = document.getElementById('searchBtn');

    const handleSearch = () => {
        const val = sInp.value.trim();
        if (val.length >= 2) runSearch(val);
    };

    if(sInp) {
        sInp.addEventListener('input', (e) => {
            if (e.target.value.trim().length === 0) {
                document.getElementById('results').innerHTML = '';
            } else if (e.target.value.trim().length >= 2) {
                runSearch(e.target.value.trim());
            }
        });
    }
    if(sBtn) sBtn.onclick = handleSearch;
}

// --- VERİ ÇEKME FONKSİYONLARI ---

async function runSearch(q) {
    const { data } = await _supabase.from('kelimeler').select('*')
        .or(`kelime.ilike.%${q}%,anlam.ilike.%${q}%`).limit(30);
    render(data);
}

async function getByLetter(l) {
    const { data } = await _supabase.from('kelimeler').select('*')
        .ilike('kelime', `${l}%`)
        .order('kelime', { ascending: true });
    render(data);
}

async function filterByCategory(cat) {
    const { data } = await _supabase.from('kelimeler')
        .select('*')
        .eq('kategori', cat)
        .order('kelime', { ascending: true });
    render(data);
}

// --- EKRANA BASMA (PARA MODÜLÜ DAHİL) ---

function render(data) {
    const res = document.getElementById('results');
    if(!res) return;
    res.innerHTML = '';

    if (!data || data.length === 0) {
        res.innerHTML = '<div style="text-align:center; padding:4rem; opacity:0.4; font-weight:600;">Eşleşen bilgi bulunamadı...</div>';
        return;
    }

    data.forEach((item, index) => {
        // HER 4 KARTTA BİR REKLAM ALANI OLUŞTUR (Gelir İçin)
        if (index > 0 && index % 4 === 0) {
            const ad = document.createElement('div');
            ad.className = 'ad-slot';
            ad.innerHTML = 'Sponsorlu İçerik / Reklam Yerleşimi';
            res.appendChild(ad);
        }

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

// Başlat
window.onload = setupSite;
