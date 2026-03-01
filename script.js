// 1. Supabase Bağlantısı
// BURAYI GÜNCELLE: Supabase'den aldığın o çok uzun 'anon public' key'i tırnak içine yapıştır.
const SUPABASE_URL = 'https://mvsbrknkfwwptjifdqca.supabase.co';
const SUPABASE_KEY = 'BURAYA_ANON_KEY_GELECEK'; 
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// 2. Arama Fonksiyonu
async function ara() {
    const input = document.getElementById('searchInput').value.toUpperCase();
    const sonucDiv = document.getElementById('result');
    
    // Kullanıcı en az 2 harf yazana kadar arama yapma (performans için)
    if(input.length < 2) {
        sonucDiv.innerHTML = "";
        return;
    }

    // 3. Veritabanından Veri Çekme
    // 'kelimeler' tablosunda, 'kelime' sütunu içinde kullanıcının yazdığı harfleri ara
    const { data: sonuclar, error } = await _supabase
        .from('kelimeler')
        .select('*')
        .ilike('kelime', `%${input}%`); // ilike: Büyük/küçük harf duyarsız arama yapar

    // 4. Sonuçları Ekrana Yazdırma
    if (sonuclar && sonuclar.length > 0) {
        sonucDiv.innerHTML = sonuclar.map(s => `
            <div class="word-card" style="border: 1px solid #ddd; padding: 15px; margin: 10px 0; border-radius: 8px;">
                <h3 style="color: #007bff; margin-top: 0;">${s.kelime}</h3>
                <p style="color: #333; line-height: 1.5;">${s.anlam}</p>
            </div>
        `).join('');
    } else {
        sonucDiv.innerHTML = "<p style='color: #666;'>Sonuç bulunamadı...</p>";
    }
}
