window.onload = async () => {
    initStrips();
    const { data } = await getWords(); // Başlangıç verisi
    renderWords(data, "Günün Kelimeleri");

    document.getElementById('searchBtn').onclick = async () => {
        const val = document.getElementById('sInp').value;
        const { data } = await getWords({ search: val });
        renderWords(data, `"${val}" araması`);
    };
};

function initStrips() {
    // Alfabe butonlarını oluştur
    const alpha = "ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ".split("");
    alpha.forEach(l => {
        const btn = document.createElement('button');
        btn.className = 'btn-s'; btn.innerText = l;
        btn.onclick = async () => {
            const { data } = await getWords({ column: 'kelime', value: `${l}%`, op: 'ilike' });
            renderWords(data, `${l} Harfi`);
        };
        document.getElementById('alphaStrip').appendChild(btn);
    });
}