const URL = "https://mvsbrknkfwwptjifdqca.supabase.co";
const KEY = "sb_publishable_siHYnBPzrZSyHcx01nopsA_I4im8Ygr";

const _db = supabase.createClient(URL, KEY);

async function getWords(params = {}) {
    let query = _db.from('kelimeler').select('*');
    if (params.column) query = query.eq(params.column, params.value);
    if (params.search) query = query.ilike('kelime', `%${params.search}%`);
    return await query;
}

