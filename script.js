const SB_URL = 'https://mvsbrknkfwwptjifdqca.supabase.co';
const SB_KEY = 'sb_publishable_siHYnBPzrZSyHcx01nopsA_I4im8Ygr';
const _supabase = supabase.createClient(SB_URL, SB_KEY);

window.onload = () => {
    initAlphabet();
    loadCategories();
    initSearch();
    showVitrin();
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

function render(data, title = "") {
    const res = document.getElementById('results');
    if(!res) return;
    res.innerHTML = title ? `<h4 style="text-align:center; opacity:0.5; margin-bottom:1.5rem;">${title}</h4>` : '';

    if(!data || data.length === 0) {
        res.innerHTML = '<div style="text-align:center; padding:3rem; opacity:0.5">Sonuç bulunamadı.</div>';
        return;
    }

    data.forEach((item, index) => {
        if(index > 0 && index % 5 === 0) {
            const ad = document.createElement('div');
            ad.className = 'ad-slot';
            ad.innerText = 'SPONSORLU BAĞLANTI';
            res.appendChild(ad);
        }

        const d = document.createElement('div');
        d.className = 'word-card';
        
        let cbg = '#f1f5f9', ctx = '#64748b';
        if(item.kategori === 'Tıp') { cbg='#fee2e2'; ctx='#991b1b'; }
        else if(item.kategori === 'Tarih') { cbg='#fff7ed'; ctx='#9a3412'; }
        else if(item.kategori === 'Doğa') { cbg='#f0fdf4'; ctx='#166534'; }
        else if(item.kategori === 'Denizcilik') { cbg='#e0f2fe'; ctx='#0369a1'; }

        d.innerHTML = `
            <div class="card-header">
                <span class="label">Tanım</span>
                <span class="cat-badge" style="background:${cbg}; color:${ctx}">${item.kategori || 'Genel'}</span>
            </div>
            <p>${item.anlam}</p>
            <div class="answer-section">
                <span class="label" style="color:var(--primary)">Cevap</span>
                <h2>${item.kelime}</h2>
            </div>
            <div class="card-footer" id="footer-${item.id}">
                <button class="action-btn" onclick="copyMe('${item.kelime.replace(/'/g, "\\'")}', '${item.anlam.replace(/'/g, "\\'")}', ${item.id})">Kopyala</button>
                <button class="action-btn" onclick="shareMe('${item.kelime.replace(/'/g, "\\'")}', '${item.anlam.replace(/'/g, "\\'")}')">Paylaş</button>
            </div>
        `;
        res.appendChild(d);
    });
}

function copyMe(w, m, id) {
    const t = `Soru: ${m}\nCevap: ${w}\n\nKaynak: ${window.location.href}`;
    navigator.clipboard.writeText(t).then(() => {
        const footer = document.getElementById(`footer-${id}`);
        if(footer) {
            // Eski mesaj varsa sil
            const oldMsg = footer.querySelector('.temp-msg');
            if(oldMsg) oldMsg.remove();

            // Yeni mesaj yarat
            const msg = document.createElement('span');
            msg.className = 'temp-msg';
            msg.innerText = 'Kopyalandı!';
            msg.style = "color:#10b981; font-size:0.7rem; font-weight:bold; margin-right:auto;";
            footer.prepend(msg);
            
            setTimeout(() => { msg.remove(); }, 2000);
        }
    });
}

function shareMe(w, m) {
    if(navigator.share) {
        navigator.share({
            title: 'KelimeKelime Sözlük',
            text: `${m} - Cevap: ${w}`,
            url: window.location.href
        }).catch(() => {});
    }
}
