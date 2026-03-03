const SB_URL = 'https://mvsbrknkfwwptjifdqca.supabase.co';
const SB_KEY = 'sb_publishable_siHYnBPzrZSyHcx01nopsA_I4im8Ygr';
const _supabase = supabase.createClient(SB_URL, SB_KEY);

window.onload = () => {
    initAlphabet();
    loadCategories();
    initSearch();
    showVitrin(); // Her gün değişen vitrini yükle
};

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

function loadCategories() {
    const strip = document.getElementById('categoryStrip');
    if(!strip) return;
    const cats = ["Tarih", "Sanat", "İnanç", "Doğa", "Tıp", "Siyaset", "Spor", "Denizcilik"];
    strip.innerHTML = '';
    
    // Rastgele Kelime Butonu (Bonus)
    const rndBtn = document.createElement('button');
    rndBtn.className = 'cat-btn';
    rndBtn.innerHTML = '🎲 Rastgele';
    rndBtn.style.background = 'var(--primary-light)';
    rndBtn.style.color = 'var(--primary)';
    rndBtn.onclick = () => fetchRandomWord();
    strip.appendChild(rndBtn);

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

// GÜNÜN KELİMELERİNİ HER GÜN DEĞİŞTİREN FONKSİYON
async function showVitrin() {
    // Toplam kelime sayısını alıp içinden o güne özel rastgele bir küme seçeceğiz
    const { data: allData } = await _supabase.from('kelimeler').select('id');
    
    if (allData && allData.length > 0) {
        // Bugünün tarihini sayıya çevir (Örn: 20260303)
        const today = new Date();
        const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
        
        // Bu seed'i kullanarak listeden her gün farklı ama o gün sabit 5 kelime seç
        const shuffled = [...allData].sort(() => {
            const x = Math.sin(seed) * 10000;
            return (x - Math.floor(x)) - 0.5;
        });
        
        const selectedIds = shuffled.slice(0, 5).map(item => item.id);
        
        const { data: dailyWords } = await _supabase
            .from('kelimeler')
            .select('*')
            .in('id', selectedIds);

        render(dailyWords, "📅 Bugünün Öne Çıkan Kelimeleri");
    }
}

async function fetchRandomWord() {
    const { data } = await _supabase.from('kelimeler').select('*').limit(100);
    if(data) {
        const randomItem = [data[Math.floor(Math.random() * data.length)]];
        render(randomItem, "🎲 Şansına Ne Çıktı?");
    }
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

function render(data, title = "") {
    const res = document.getElementById('results');
    if(!res) return;
    res.innerHTML = title ? `<h4 style="text-align:center; color:var(--text-main); font-weight:800; margin-bottom:1.5rem;">${title}</h4>` : '';

    if(!data || data.length === 0) {
        res.innerHTML = '<div style="text-align:center; padding:3rem; opacity:0.5">Sonuç bulunamadı.</div>';
        return;
    }

    data.forEach((item, index) => {
        const d = document.createElement('div');
        d.className = 'word-card';
        
        let cbg = '#f1f5f9', ctx = '#647
