// database.js
const URL = "SENİN_URL_ADRESİN";
const KEY = "SENİN_KEY_ADRESİN";

// window._db diyerek bunu tüm dosyaların görebileceği bir "evrensel" değişken yapıyoruz
window._db = supabase.createClient(URL, KEY);

async function getWords(params = {}) {
    let query = window._db.from('kelimeler').select('*');
    if (params.column) query = query.ilike(params.column, params.value);
    if (params.search) query = query.ilike('kelime', `%${params.search}%`);
    return await query;
}
