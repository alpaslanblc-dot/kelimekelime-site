const SB_URL = 'https://mvsbrknkfwwptjifdqca.supabase.co';
const SB_KEY = 'sb_publishable_siHYnBPzrZSyHcx01nopsA_I4im8Ygr';
const _supabase = supabase.createClient(SB_URL, SB_KEY);

let searchTimer; // Debounce (geciktirme) için zamanlayıcı

window.onload = () => {
    initAlphabet();
    loadCategories();
    initSearch();
    showVitrin();
};

function initAlphabet() {
    const alphabet = "ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ".split("");
    const strip = document.getElementById('alphabetStrip');
    if (!strip) return;
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
    if (!strip) return;
    const cats = ["Tarih", "Sanat", "İnanç", "Doğa", "Tıp", "Siyaset", "Spor", "Denizcilik"];
    strip.innerHTML = '';

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
    if (inp) {
        inp.oninput = (e) => {
            clearTimeout(searchTimer);
            const val = e.target.value.trim();
            // Performans: Her harfte değil, yazma bitince (300ms sonra) ara
            searchTimer = setTimeout(() => {
                if (val.length >= 2) runSearch(val);
                else if (val.length === 0) showVitrin();
            }, 300);
        };
    }
    if (btn) btn.onclick = () => runSearch(inp.value.trim());
}

async function showVitrin() {
    try {
        const { data: allData, error } = await _supabase.from('kelimeler').select('id');
        if (error) throw error;

        if (allData && allData.length > 0) {
            const today = new Date();
            const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();

            const shuffled = [...allData].sort(() => {
                const x = Math.sin(seed) * 10000;
                return (x - Math.floor(x)) - 0.5;
            });

            const selectedIds = shuffled.slice(0, 5).map(item => item.id);
            const { data: dailyWords, error: fetchError } = await _supabase
                .from('kelimeler')
                .select('*')
                .in('id', selectedIds);
            
            if (fetchError) throw fetchError;
            render(dailyWords, "📅 Bugünün Öne Çıkan Kelimeleri");
        }
    } catch (err) {
        console.error("Vitrin yüklenemedi:", err);
    }
}

async function fetchRandomWord() {
    try {
        const { data, error } = await _supabase.from('kelimeler').select('*').limit(100);
        if (error) throw error;
        if (data) {
            const randomItem = [data[Math.floor(Math.random() * data.length)]];
            render(randomItem, "🎲 Şansına Ne Çıktı?");
        }
    } catch (err) {
        handleError("Rastgele kelime getirilemedi.");
    }
}

async function runSearch(q) {
    try {
        // Analytics Takibi: Kullanıcının ne aradığını kaydedelim
        if (typeof gtag === 'function') {
            gtag('event', 'search', { 'search_term': q });
        }

        const { data, error } = await _supabase.from('kelimeler').select('*').or(`kelime.ilike.%${q}%,anlam.ilike.%${q}%`).limit(25);
        if (error) throw error;
        render(data);
    } catch (err) {
        handleError("Arama sırasında bir hata oluştu.");
    }
}

async function getByLetter(l) {
    try {
        const { data, error } = await _supabase.from('kelimeler').select('*').ilike('kelime', `${l}%`).order('kelime');
        if (error) throw error;
        render(data, `${l} Harfi İle Başlayanlar`);
    } catch (err) {
        handleError("Liste yüklenirken bir hata oluştu.");
    }
}

async function filterByCategory(cat) {
    try {
        const { data, error } = await _supabase.from('kelimeler').select('*').eq('kategori', cat).order('kelime');
        if (error) throw error;
        render(data, `${cat} Kategorisi`);
    } catch (err) {
        handleError("Kategori verileri alınamadı.");
    }
}

// Yeni: Sistemsel Hataları Kullanıcıya Gösterme
function handleError(msg) {
    const res = document.getElementById('results');
    res.innerHTML = `
        <div style="text-align:center; padding:3rem; color:var(--text-muted);">
            <p style="font-size:2rem;">⚠️</p>
            <p>${msg}</p>
            <button onclick="location.reload()" style="background:var(--primary); color:white; border:none; padding:8px 16px; border-radius:8px; cursor:pointer; margin-top:10px;">Yenile</button>
        </div>`;
}

function render(data, title = "") {
    const res = document.getElementById('results');
    if (!res) return;
    res.innerHTML = title ? `<h2 style="text-align:center; color:var(--text-main); font-weight:800; margin-bottom:1.5rem; font-size:1.2rem;">${title}</h2>` : '';

    if (!data || data.length === 0) {
        res.innerHTML = `
            <div style="text-align:center; padding:3rem;">
                <p style="opacity:0.5; margin-bottom:1rem;">Sonuç bulunamadı.</p>
                <button onclick="showContactForm()" style="background:var(--primary-light); color:var(--primary); border:none; padding:10px 20px; border-radius:10px; font-weight:700; cursor:pointer;">
                    Kelime Öner
                </button>
            </div>`;
        return;
    }

    data.forEach((item) => {
        const art = document.createElement('article');
        art.className = 'word-card';
        art.setAttribute('itemscope', '');
        art.setAttribute('itemtype', 'https://schema.org/DefinedTerm');
        
        art.innerHTML = `
            <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
                <span style="font-size:0.7rem; font-weight:800; color:var(--text-muted); text-transform:uppercase;">Tanım</span>
                <span itemprop="category" style="background:var(--primary-light); color:var(--primary); padding:4px 8px; border-radius:6px; font-size:0.7rem; font-weight:800;">${item.kategori || 'Genel'}</span>
            </div>
            <p itemprop="description" style="font-size:1.1rem; color:var(--text-main); margin-bottom:15px; font-weight:500; line-height:1.5;">${item.anlam}</p>
            <div style="border-top:1px solid var(--border); padding-top:10px;">
                <span style="font-size:0.7rem; font-weight:800; color:var(--primary); text-transform:uppercase;">Cevap</span>
                <h2 itemprop="name" style="margin:0; font-size:1.7rem; color:var(--text-main); font-weight:800; letter-spacing:1px;">${item.kelime}</h2>
            </div>
        `;
        res.appendChild(art);
    });
}
