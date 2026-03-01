// 1. BAĞLANTI AYARLARI (Kendi bilgilerini tırnak içine yapıştır)
const SB_URL = 'https://mvsbrknkfwwptjifdqca.supabase.co';
const SB_KEY = 'sb_publishable_siHYnBPzrZSyHcx01nopsA_I4im8Ygr';

const _supabase = supabase.createClient(SB_URL, SB_KEY);

document.addEventListener('DOMContentLoaded', () => {
    // Alfabe butonlarını oluştur
    const alphabet = "ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ".split("");
    const strip = document.getElementById('alphabetStrip');
    if(strip) {
        alphabet.forEach(l => {
            const b = document.createElement('button');
            b.innerText = l;
            b.className = 'letter-btn';
            b.onclick = () => getByLetter(l);
            strip.appendChild(b);
        });
    }

    // Arama butonu ve Enter tuşu
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    
    if(searchBtn && searchInput) {
        searchBtn.onclick = () => search(searchInput.value);
        searchInput.onkeypress = (e) => { if (e.key === 'Enter') search(e.target.value); };
    }
});

// Veri Çekme Fonksiyonları
async function search(q) {
    if(!q) return;
    const { data } = await _supabase.from('kelimeler').select('*').ilike('kelime', `%${q}%`);
    render(data);
}

async function getByLetter(l) {
    const { data } = await _supabase.from('kelimeler').select('*').ilike('kelime', `${l}%`);
    render(data);
}

// 2. EKRANA BASMA (HATA PAYI SIFIRLANMIŞ SİSTEM)
function render(data) {
    const res = document.getElementById('results');
    if(!res) return;
    res.innerHTML = '';

    if (!data || data.length === 0) {
        res.innerHTML = '<p style="text-align:center; opacity:0.6; padding:2rem;">Aranan kelime bulunamadı.</p>';
        return;
    }

    data.forEach(item => {
        // OTOMATİK İÇERİK BULUCU: 
        // Kod burada 'kelime', 'id', 'created_at' dışındaki İLK dolu sütunu tanım olarak seçer.
        // Yani sütun adın 'tanım', 'tanim', 'aciklama' ne olursa olsun çalışır.
        let bulunanTanim = "Açıklama mevcut değil.";
        
        // Veritabanından gelen tüm anahtarları (sütun isimlerini) tara
        const keys = Object.keys(item);
        for (let key of keys) {
            const lowKey = key.toLowerCase();
            // id, kelime ve tarih dışındaki ilk metin alanını al
            if (!['id', 'kelime', 'created_at'].includes(lowKey) && item[key]) {
                bulunanTanim = item[key];
                break; 
            }
        }

        const d = document.createElement('div');
        d.className = 'word-card';
        d.innerHTML = `
            <h2>${item.kelime || "Başlıksız"}</h2>
            <p>${bulunanTanim}</p>
        `;
        res.appendChild(d);
    });
}
