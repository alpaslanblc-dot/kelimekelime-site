// 1. Bağlantı Bilgileri (Admin panelindekiyle aynı olmalı)
const SUPABASE_URL = 'https://mvsbrknkfwwptjifdqca.supabase.co';
const SUPABASE_KEY = 'sb_publishable_siHYnBPzrZSyHcx01nopsA_I4im8Ygr'; 

// 2. Supabase İstemcisini Başlat
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// 3. Arama Fonksiyonu
async function ara() {
    const input = document.getElementById('searchInput').value.toUpperCase().trim();
    const sonucDiv = document.getElementById('result');
    
    // En az 2 harf girilince ara (hız için)
    if(input.length < 2) {
        sonucDiv.innerHTML = "";
        return;
    }

    // Veritabanından kelimeyi çek
    const { data: sonuclar, error } = await _supabase
        .from('kelimeler') // Tablo isminin 'kelimeler' olduğundan emin ol
        .select('*')
        .ilike('kelime', `%${input}%`); // İçinde geçenleri bul

    if (error) {
        console.error("Arama hatası:", error.message);
        return;
    }

    // Sonuçları ekrana bas
    if (sonuclar && sonuclar.length > 0) {
        sonucDiv.innerHTML = sonuclar.map(s => `
            <div class="word-card" style="background:white; padding:20px; border-radius:8px; margin-bottom:15px; box-shadow:0 2px 5px rgba(0,0,0,0.1); border-left: 5px solid #007bff;">
                <h3 style="color:#007bff; margin:0 0 10px 0; text-transform: uppercase;">${s.kelime}</h3>
                <p style="margin:0; color:#444; line-height:1.6; font-size:1.1em;">${s.anlam}</p>
            </div>
        `).join('');
    } else {
        sonucDiv.innerHTML = "<p style='text-align:center; color:#666; background:#eee; padding:10px; border-radius:5px;'>Aradığınız kelime henüz sözlükte yok.</p>";
    }
}
