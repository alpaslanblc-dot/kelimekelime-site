const URL = "SENİN_SUPABASE_URL_ADRESİN";
const KEY = "SENİN_SUPABASE_ANON_KEY_ADRESİN";

const _db = supabase.createClient(URL, KEY);

async function getWords(params = {}) {
    let query = _db.from('kelimeler').select('*');
    if (params.column) query = query.eq(params.column, params.value);
    if (params.search) query = query.ilike('kelime', `%${params.search}%`);
    return await query;
}
