const SB_URL = 'https://mvsbrknkfwwptjifdqca.supabase.co';
const SB_KEY = 'sb_publishable_siHYnBPzrZSyHcx01nopsA_I4im8Ygr';
const _supabase = supabase.createClient(SB_URL, SB_KEY);

// 1. ANA BAŞLATICI
window.onload = () => {
    initAlphabet();
    loadCategories();
    initSearch();
    showVitrin();
};

// 2. ALFABE OLUŞTURUCU
function initAlphabet() {
    const alphabet = "ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ".split("");
    const strip = document.getElementById('alphabetStrip');
    if(!strip) return;
    strip.innerHTML = '';
    alphabet.forEach(l => {
        const b = document.createElement('button');
        b.className = 'letter-btn';
        b.innerText = l;
        b.onclick = () => getByLetter(l);
        strip.appendChild(b);
    });
}

// 3. KATEGORİ OLUŞTURUCU
function loadCategories() {
    const strip = document.getElementById('categoryStrip');
    if(!strip) return;
    const cats = ["Tarih", "Sanat", "İnanç", "Doğa", "Tıp", "Siyaset", "Spor", "Denizcilik"];
    strip.innerHTML = '';
    cats.forEach(c => {
        const b = document.createElement('button');
        b.className = 'cat-btn';
        b.innerText = c;
        b.onclick = () => {
            document.querySelectorAll('.cat-btn').forEach(btn => btn.classList.remove('active'));
            b.classList.add('active');
            filterByCategory(c);
        };
        strip.appendChild(b);
    });
}

// 4. ARAMA MOTORU
function initSearch() {
    const inp = document.getElementById('searchInput');
    const btn = document.getElementById('searchBtn');
    if(inp) {
        inp.oninput = (e) => {
            const val = e.target.value.trim();
            if(val.length >= 2) runSearch(val);
            else if(val.length === 0) showVitrin();
        };
    }
    if(btn) btn.onclick = () => runSearch(inp.value.trim());
}

// 5. VERİ ÇEKME FONKSİYONLARI
async function showVitrin() {
    const { data } = await _supabase.from('kelimeler').select('*').limit(10).order('id', {ascending: false});
    render(data, "Günün Öne Çıkan Kelimeleri");
}

async function runSearch(q) {
    const { data } = await _supabase.from('kelimeler').select('*').or(`kelime.ilike.%${q}%,anlam.ilike.%${q}%`).limit(25);
    render(data);
}

async function getByLetter(l) {
    const { data } = await _supabase.from('kelimeler').select('*').ilike('kelime', `${l}%`).order('kelime');
    render(data);
}

async function filterByCategory(cat) {
    const { data } = await _supabase.from('kelimeler').select('*').eq('kategori', cat).order('kelime');
    render(data);
}

// 6. EKRANA BASMA (RENDER)
function render(data, title = "") {
    const res = document.getElementById('results');
    if(!res) return;
    res.
