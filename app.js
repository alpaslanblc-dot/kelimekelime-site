window.onload = async () => {
    // Harfleri Oluştur
    const alpha = "ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ".split("");
    const alphaStrip = document.getElementById('alphaStrip');
    
    alpha.forEach(l => {
        const btn = document.createElement('button');
        btn.className = 'btn-s';
        btn.innerText = l;
        btn.onclick = async () => {
            const { data } = await getWords({ column: 'kelime', value: `${l}%`, op: 'ilike' });
            renderWords(data, `${l} Harfi İle Başlayanlar`);
        };
        alphaStrip.appendChild(btn);
    });

    // Arama Butonu Mantığı
    document.getElementById('searchBtn').onclick = async () => {
        const val = document.getElementById('sInp').value;
        if(val) {
            const { data } = await getWords({ search: val });
            renderWords(data, `"${val}" Arama Sonuçları`);
        }
    };

    // İlk açılışta verileri çek
    const { data } = await getWords();
    renderWords(data, "Günün Öne Çıkanları");
};
