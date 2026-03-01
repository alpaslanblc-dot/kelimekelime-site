// --- BURAYI DÜZENLE ---
const SUPABASE_URL = 'https://mvsbrknkfwwptjifdqca.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12c2Jya25rZnd3cHRqaWZkcWNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIzNjc1OTYsImV4cCI6MjA4Nzk0MzU5Nn0.k-DdP3f7slgFkNvIMrAF6L_3nLbQYkVvJtQFMRP8NqM'; 
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
