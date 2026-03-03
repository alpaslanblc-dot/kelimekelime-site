const view = document.getElementById('viewArea');

function renderWords(data, title) {
    view.innerHTML = `<h3 style="margin-bottom:15px; color:var(--m);">${title}</h3>`;
    if (!data || data.length === 0) {
        view.innerHTML += `<div class="card">Sonuç bulunamadı.</div>`;
        return;
    }

    data.forEach((item, index) => {
        // Her 4 kartta bir reklam yeri aç
        if (index > 0 && index % 4 === 0) {
            view.innerHTML += `<div class="ad-box">Reklam Alanı</div>`;
        }

        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <small>${item.kategori || 'Genel'}</small>
            <p style="font-size:1.1rem; margin:10px 0;">${item.anlam}</p>
            <h2 style="color:var(--p);">${item.kelime.toUpperCase()}</h2>
        `;
        
        // Eğer admin açıksa silme butonu ekle
        if (typeof checkAdminStatus === "function" && checkAdminStatus()) {
            const btn = document.createElement('button');
            btn.innerText = "SİL";
            btn.onclick = () => handleDelete(item.id);
            card.appendChild(btn);
        }

        view.appendChild(card);
    });
}