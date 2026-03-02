const SB_URL = 'https://mvsbrknkfwwptjifdqca.supabase.co';
const SB_KEY = 'sb_publishable_siHYnBPzrZSyHcx01nopsA_I4im8Ygr';
const _supabase = supabase.createClient(SB_URL, SB_KEY);

// 1. ANA BAŞLATICI (Sıralama Düzeltildi)
function setupSite() {
    initAlphabet();     // Önce alfabe
    loadCategories();   // Sonra kategoriler
    initSearch();       // Sonra arama
}

// 2. ALFABE (Geri Getirildi)
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

// 3. KATEGORİLER (Sabit Liste)
function loadCategories() {
    const catStrip = document.getElementById('categoryStrip');
    if (!catStrip) return;

    const myCategories = ["Tarih", "Sanat", "İnanç", "Doğa", "Tıp", "Siyaset", "Spor", "Denizcilik"];

    catStrip.innerHTML = '';
    myCategories.forEach(cat => {
        const btn = document.createElement('button');
        btn.innerText = cat;
        btn.className = 'cat-btn';
        btn.onclick = () => filterByCategory(cat);
        catStrip.appendChild(btn);
    });
}

// 4. ARAMA MOTORU
function initSearch() {
    const sInp = document.getElementById('searchInput');
    if(sInp) {
        sInp.addEventListener('input', (e) => {
            const val = e.target.value.trim();
            if (val.length === 0) {
                document.getElementById('results').innerHTML = '';
            } else if (val.length >= 2) {
                runSearch(val);
            }
        });
    }
}

// --- VERİ ÇEKME ---
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
    const { data } = await _supabase.from('kelimeler').select('*')
        .eq('kategori', cat).order('kelime', { ascending: true });
    render(data);
}

// --- RENDER (REKLAM ALANI DÜZELTİLDİ) ---
function render(data) {
    const res = document.getElementById('results');
    if(!res) return;
    res.innerHTML = '';

    if (!data || data.length === 0) {
        res.innerHTML = '<div style="text-align:center; padding:3rem; opacity:0.5;">Sonuç bulunamadı.</div>';
        return;
    }

    data.forEach((item, index) => {
        // Reklam alanını "ince ve profesyonel" yaptık
        if (index > 0 && index % 5 === 0) {
            const ad = document.createElement('div');
            ad.style = "margin:1rem 0; padding:10px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; text-align:center; font-size:11px; color:#94a3b8; letter-spacing:1px;";
            ad.innerHTML = "SPONSORLU BAĞLANTI";
            res.appendChild(ad);
        }

        const hasCat = item.kategori && item.kategori !== 'Genel' && item.kategori !== '';
        
        // Kategori Renkleri
        let bg = '#f1f5f9', tx = '#475569';
        const c = item.kategori || "";
        if(c === 'Tıp') { bg='#fee2e2'; tx='#991b1b'; }
        else if(c === 'Doğa') { bg='#f0fdf4'; tx='#166534'; }
        else if(c === 'İnanç') { bg='#faf5ff'; tx='#6b21a8'; }
        else if(c === 'Tarih') { bg='#fff7ed'; tx='#9a3412'; }
        else if(c === 'Denizcilik') { bg='#e0f2fe'; tx='#0369a1'; }

        const d = document.createElement('div');
        d.className = 'word-card';
        d.innerHTML = `
            <div class="card-header">
                <span class="label">Tanım</span>
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

window.onload = setupSite;
