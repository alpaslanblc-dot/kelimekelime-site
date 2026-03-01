const SUPABASE_URL = 'https://mvsbrknkfwwptjifdqca.supabase.co';
const SUPABASE_KEY = 'sb_publishable_siHYnBPzrZSyHcx01nopsA_I4im8Ygr'; 
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

async function ara() {
    const input = document.getElementById('searchInput').value.toUpperCase().trim();
    const sonucDiv = document.getElementById('result');
    
    if(input.length < 2) {
        sonucDiv.innerHTML = "";
        return;
    }

    const { data: sonuclar, error } = await _supabase
        .from('kelimeler')
        .select('*')
        .ilike('kelime', `%${input}%`);

    if (sonuclar && sonuclar.length > 0) {
        sonucDiv.innerHTML = sonuclar.map(s => `
            <div class="word-card" style="background:white; padding:20px; border-radius:8px; margin-bottom:15px; box-shadow:0 2px 5px rgba(0,0,0,0.1);">
                <h3 style="color:#007bff; margin:0 0 10px 0;">${s.kelime}</h3>
                <p style="margin:0; color:#444; line-height:1.6;">${s.anlam}</p>
            </div>
        `).join('');
    } else {
        sonucDiv.innerHTML = "<p style='text-align:center; color:#666;'>Aradığınız kelime henüz sözlükte yok.</p>";
    }
}
