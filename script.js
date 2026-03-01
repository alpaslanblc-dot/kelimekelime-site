// 1. ADIM: BAĞLANTI BİLGİLERİN
const SB_URL = 'https://mvsbrknkfwwptjifdqca.supabase.co';
const SB_KEY = 'sb_publishable_siHYnBPzrZSyHcx01nopsA_I4im8Ygr';

const _supabase = supabase.createClient(SB_URL, SB_KEY);

// 2. ADIM: SAYFA HAZIRLIĞI
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

    // Arama butonu tetikleyici
    const searchBtn = document.getElementById('searchBtn');
    if(searchBtn) {
        searchBtn.onclick = () => {
            const val = document.getElementById('searchInput').value;
            search(val);
        };
    }

    // Enter tuşu desteği
    const searchInput = document.getElementById('searchInput');
    if(searchInput) {
        searchInput.onkeypress = (e) => {
            if (e.key === 'Enter') search(e.target.value);
        };
    }
});

// 3. ADIM: VERİ ÇEKME FONKSİYONLARI
async function search(q) {
    if(!q) return;
    const { data, error } = await _supabase.from('kelimeler').select('*').ilike('kelime', `%${q}%`);
    if (error) console.error("Arama hatası:", error);
    render(data);
}

async function getByLetter(l) {
    const { data, error } = await _supabase.from('kelimeler').select('*').ilike('kelime', `${l}%`);
    if (error) console.error("Harf hatası:", error);
    render(data);
}

// 4. ADIM: EKRANA BASMA (KRİTİK DÜZELTME BURADA)
function render(data) {
    const res = document.getElementById('results');
    if(!res) return;
    
    res.innerHTML = '';
    
    if (!data || data.length === 0) {
        res.innerHTML = '<p style="text-align:center; opacity:0.6; padding:2rem;">Sonuç bulunamadı.</p>';
        return;
    }

    data.forEach(item => {
        const d = document.createElement('div');
        d.className = 'word-card';
        
        // Sütun adı 'tanim' da olsa 'tanım' da olsa ikisini de kontrol eder:
        const tanimIcerigi = item.tanim || item.tanım || item.aciklama || "Açıklama henüz girilmemiş.";
        
        d.innerHTML = `
            <h2>${item.kelime}</h2>
            <p>${tanimIcerigi}</p>
        `;
        res.appendChild(d);
    });
}
