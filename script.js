// Supabase Ayarları
const SUPABASE_URL = 'https://mvsbrknkfwwptjifdqca.supabase.co';
const SUPABASE_KEY = 'sb_publishable_siHYnBPzrZSyHcx01nopsA_I4im8Ygr'; 
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

async function ara() {
    const input = document.getElementById('searchInput').value.toUpperCase().trim();
    const sonucDiv = document.getElementById('result');
    
    // 2 harften azsa sonuçları temizle
    if(input.length < 2) {
        sonucDiv.innerHTML = "";
        return;
    }

    // Veritabanında ara
    const { data: sonuclar, error } = await _supabase
        .from('kelimeler') 
        .select('*')
        .ilike('kelime', `%${input}%`); 

    if (error) {
        console.error("Hata:", error.message);
        return;
    }

    // Ekrana yazdır
    if (sonuclar && sonuclar.length > 0) {
        sonucDiv.innerHTML = sonuclar.map(s => `
            <div class="word-card">
                <h3>${s.kelime}</h3>
                <p>${s.anlam}</p>
            </div>
        `).join('');
    } else {
        sonucDiv.innerHTML = "<p style='text-align:center; color:#888;'>Kelime bulunamadı.</p>";
    }
} 
