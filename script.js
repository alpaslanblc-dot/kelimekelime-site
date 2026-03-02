const SB_URL = 'https://mvsbrknkfwwptjifdqca.supabase.co';
const SB_KEY = 'sb_publishable_siHYnBPzrZSyHcx01nopsA_I4im8Ygr';
const _supabase = supabase.createClient(SB_URL, SB_KEY);

// Ana Başlatıcı
async function setupSite() {
    initAlphabet();     // Alfabe butonlarını diz
    loadCategories();   // Belirlediğin 8 ana kategoriyi diz
    initSearch();       // Arama motorunu aktif et
}

// 1. KATEGORİ YÖNETİMİ (Para Makinesinin Temeli)
function loadCategories() {
    const catStrip = document.getElementById('categoryStrip');
    if (!catStrip) return;

    // İstediğin Kesin Liste
    const myCategories = ["Tarih", "Sanat", "İnanç", "Doğa", "Tıp", "Siyaset", "Spor", "Denizcilik"];

    catStrip.innerHTML = '';
    myCategories.forEach(cat => {
        const btn = document.createElement('button');
        btn.innerText = cat;
        btn.className = 'cat-btn';
        btn.onclick = () => {
            // Görsel geri bildirim: Aktif butonu boya
            document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterByCategory(cat);
        };
        catStrip.appendChild(btn);
    });
}

// 2. ALFABE YÖNETİMİ
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

// 3. ARAMA MOTORU (SEO Dostu)
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

// --- RENDER (PARA VE REKLAM MODÜLÜ) ---

function render(data) {
    const res = document.getElementById('results');
    if(!res) return;
    res.innerHTML = '';

    if (!data || data.length === 0) {
        res.innerHTML = '<div style="text-align:center; padding:4rem; opacity:0.4;">Bu kategoride henüz kelime bulunmuyor...</div>';
        return;
    }

    data.forEach((item, index) => {
        // REKLAM ENJEKSİYONU: Her 4 kartta bir reklam alanı açar
        if (index > 0 && index % 4 === 0) {
            const ad = document.createElement('div');
            ad.className = 'ad-slot';
            ad.innerHTML = 'Sponsorlu Bağlantı / Reklam Alanı';
            res.appendChild(
