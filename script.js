// MİMARİ AYARLAR
const config = {
    urlPrefix: '/kelime/',
    limit: 25
};

// URL YÖNETİMİ (SEO İÇİN KRİTİK)
function updateURL(path, title) {
    if (window.location.pathname !== path) {
        window.history.pushState({ path: path }, title, path);
        document.title = title + " | KelimeKelime";
    }
}

// ARANAN KELİMEYİ VEYA URL'DEKİ KELİMEYİ GETİR
async function fetchSpecificWord(word) {
    try {
        const { data, error } = await _supabase
            .from('kelimeler')
            .select('*')
            .ilike('kelime', word)
            .single();

        if (error) throw error;
        if (data) {
            render([data], `"${data.kelime}" Anlamı ve Tanımı`);
            // SEO verisini başlığa yaz
            document.title = `${data.kelime} Ne Demek? | KelimeKelime`;
        }
    } catch (err) {
        runSearch(word); // Tam eşleşme yoksa genel aramaya dön
    }
}

// BAŞLANGIÇ KONTROLÜ (URL'den veri okuma)
window.onpopstate = () => {
    const path = window.location.pathname;
    if (path.startsWith(config.urlPrefix)) {
        const word = path.replace(config.urlPrefix, '');
        fetchSpecificWord(decodeURIComponent(word));
    }
};

// Geliştirilmiş Render (AdSense Reklam Alanları Dahil)
function render(data, title = "") {
    const res = document.getElementById('results');
    res.innerHTML = title ? `<h2 class="section-title">${title}</h2>` : '';

    if (!data || data.length === 0) {
        res.innerHTML += `<div class="no-result">Bulunamadı. <button onclick="openForm('öner')">Öner</button></div>`;
        return;
    }

    data.forEach((item, index) => {
        // Her 5 kartta bir reklam alanı ekle (Monetization hazırlığı)
        if (index > 0 && index % 5 === 0) {
            res.innerHTML += `<div class="ad-slot">Reklam Alanı (AdSense)</div>`;
        }

        const art = document.createElement('article');
        art.className = 'word-card';
        art.onclick = () => {
            updateURL(config.urlPrefix + item.kelime.toLowerCase(), item.kelime);
            render([item], item.kelime);
        };
        
        art.innerHTML = `
            <div class="card-header">
                <span>TANIM</span>
                <span class="cat-tag">${item.kategori || 'Genel'}</span>
            </div>
            <p class="word-desc">${item.anlam}</p>
            <div class="card-footer">
                <span>CEVAP</span>
                <h2 class="word-title">${item.kelime}</h2>
            </div>
        `;
        res.appendChild(art);
    });
}
