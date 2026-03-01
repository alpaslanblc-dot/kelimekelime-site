// --- BURAYI DÜZENLE ---
const SUPABASE_URL = 'https://mvsbrknkfwwptjifdqca.supabase.co';
const SUPABASE_KEY = 'sb_secret_8apKAGPyb9T47LwBPsZeHg_EkLLtC_W'; 
// ----------------------

const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

async function ara() {
    const input = document.getElementById('searchInput').value.toUpperCase();
    const sonucDiv = document.getElementById('result');
    
    if(input.length < 2) { sonucDiv.innerHTML = ""; return; }

    const { data: sonuclar } = await _supabase
        .from('kelimeler')
        .select('*')
        .ilike('kelime', `%${input}%`);

    if (sonuclar && sonuclar.length > 0) {
        sonucDiv.innerHTML = sonuclar.map(s => `
            <div class="word-card">
                <h3>${s.kelime}</h3>
                <p>${s.anlam}</p>
            </div>
        `).join('');
    } else {
        sonucDiv.innerHTML = "<p>Sonuç bulunamadı.</p>";
    }
}
