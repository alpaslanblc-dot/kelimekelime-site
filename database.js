const SB_URL = "https://mvsbrknkfwwptjifdqca.supabase.co";
const SB_KEY = "sb_publishable_siHYnBPzrZSyHcx01nopsA_I4im8Ygr";
const _db = supabase.createClient(SB_URL, SB_KEY);

// Veri çekme motoru
async function getWords(options = {}) {
    let query = _db.from('kelimeler').select('*');
    if (options.column && options.value) {
        if (options.op === 'ilike') query = query.ilike(options.column, options.value);
        else query = query.eq(options.column, options.value);
    }
    if (options.search) query = query.or(`kelime.ilike.%${options.search}%,anlam.ilike.%${options.search}%`);
    return await query.order('kelime');
}

async function deleteWord(id) {
    return await _db.from('kelimeler').delete().eq('id', id);
}

async function addWord(obj) {
    return await _db.from('kelimeler').insert([obj]);
}