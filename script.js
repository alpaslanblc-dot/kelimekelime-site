const SB_URL = 'https://mvsbrknkfwwptjifdqca.supabase.co';
const SB_KEY = 'sb_publishable_siHYnBPzrZSyHcx01nopsA_I4im8Ygr';
const _supabase = supabase.createClient(SB_URL, SB_KEY);

// 1. ANA BAŞLATICI
async function setupSite() {
    initAlphabet();     
    loadCategories();   
    initSearch();       
    showVitrin(); // Sayfa açıldığında vitrini göster
}

// 2. VİTRİN MODÜLÜ (Boş Sayfayı Dolduran Makine)
async function showVitrin() {
    const res = document.getElementById('results');
    res.innerHTML = '<div style="text-align:center; padding:2rem; opacity:0.3;">Sözlük hazırlanıyor...</div>';

    const { data, error } = await _supabase
        .from('kelimeler')
        .select('*')
        .limit(10)
        .order('id', { ascending: false });

    if (!error && data) {
        render(data, "Günün Öne Çıkan Kelimeleri");
    }
}

// 3. ALFABE
function initAlphabet() {
    const alphabet = "ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ".split("");
    const strip = document.getElementById('alphabetStrip');
    if(strip) {
        strip.innerHTML = ''; 
        alphabet.forEach(l => {
            const b = document.createElement('button');
            b.innerText = l; b.className = 'letter-btn';
            b.onclick = () => getByLetter(l);
            strip.appendChild(b);
        });
    }
}

// 4. KATEGORİLER
function loadCategories() {
    const catStrip = document.getElementById('categoryStrip');
    if (!catStrip) return;
    const myCategories = ["Tarih", "Sanat", "İnanç", "Doğa", "Tıp", "Siyaset", "Spor", "Denizcilik"];
    catStrip.innerHTML = '';
    myCategories.forEach(cat => {
        const btn = document.createElement('button');
        btn.innerText = cat; btn.className = 'cat-btn';
        btn.onclick = () => {
            document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterByCategory(cat);
        };
        catStrip.appendChild(btn);
    });
}

// 5. ARAMA MOTORU
function initSearch() {
    const sInp = document.getElementById('searchInput');
    if(sInp) {
        sInp.addEventListener('input', (e) => {
            const val = e.target.value.trim();
            if (val.length === 0) showVitrin(); 
            else if (val.length >= 2) runSearch(val);
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
        .ilike('kelime', `${l}%`).order('kelime', { ascending: true });
    render(data);
}

async function filterByCategory(cat) {
    const { data } = await _supabase.from('kelimeler').select('*')
        .eq('kategori', cat).order('kelime', { ascending: true });
    render(data);
}

// --- RENDER (VİTRİN, REKLAM VE PAYLAŞ BUTONLARI) ---
function render(data, title = "") {
    const res = document.getElementById('results');
    if(!res) return;
    res.innerHTML = title ? `<h3 style="text-align:center; color:var(--text-muted); margin-bottom:2rem; font-size:0.9rem; letter-spacing:2px; text-transform:uppercase;">${title}</h3>` : '';

    if (!data || data.length === 0) {
        res.innerHTML = '<div style="text-align:center; padding:3rem; opacity:0.5;">Sonuç bulunamadı.</div>';
        return;
    }

    data.forEach((item, index) => {
        if (index > 0 && index % 5 === 0) {
            const ad = document.createElement('div');
            ad.className = 'ad-slot';
            ad.innerHTML = "SPONSORLU BAĞLANTI / REKLAM ALANI";
            res.appendChild(ad);
        }

        const hasCat = item.kategori && item.kategori !== 'Genel' && item.kategori !== '';
        let bg = '#f1f5f9', tx = '#475569';
        const c = item.kategori || "";
        
        // Kategori Renk Atamaları
        if(c === 'Tıp') { bg='#fee2e2'; tx='#991b1b'; }
        else if(c === 'Doğa') { bg='#f0fdf4'; tx='#166534'; }
        else if(c === 'İnanç') { bg='#faf5ff'; tx='#6b21a8'; }
        else if(c === 'Tarih') { bg='#fff7ed'; tx='#9a3412'; }
        else if(c === 'Denizcilik') { bg='#e0f2fe'; tx='#0369a1'; }
        else if(c === 'Sanat') { bg='#fef3c7'; tx='#92400e'; }
        else if(c === 'Spor') { bg='#dcfce7'; tx='#166534'; }
        else if(c === 'Siyaset') { bg='#e2e8f0'; tx='#1e293b'; }

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
            <div class="card-footer">
                <span id="msg-${item.id}" class="copy-success">Kopyalandı!</span>
                <button class="action-btn" onclick="copyToClipboard('${item.kelime}', '${item.anlam}', ${item.id})">📋 Kopyala</button>
                <button class="action-btn" onclick="shareWord('${item.kelime}', '${item.anlam}')">🔗 Paylaş</button>
            </div>
        `;
        res.appendChild(d);
    });
}

// PAYLAŞMA VE KOPYALAMA FONKSİYONLARI
function copyToClipboard(word, meaning, id) {
    const text = `Soru: ${meaning}\nCevap: ${word}\n\nDetaylı sözlük: ${window.location.href}`;
    navigator.clipboard.writeText(text).then(() => {
        const msg = document.getElementById(`msg-${id}`);
        if(msg) {
            msg.style.display = 'inline';
            setTimeout(() => { msg.style.display = 'none'; }, 2000);
        }
    });
}

function shareWord(word, meaning) {
    if (navigator.share) {
        navigator.share({
            title: 'KelimeKelime Sözlük',
            text: `${meaning} sorusunun cevabı: ${word}`,
            url: window.location.href
        }).catch(console.error);
    } else {
        alert("Paylaşım bu tarayıcıda desteklenmiyor. Kopyala butonunu kullanabilirsiniz.");
    }
}

window.onload = setupSite;
