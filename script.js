function render(data) {
    const res = document.getElementById('results');
    if(!res) return;
    res.innerHTML = '';

    if (!data || data.length === 0) {
        res.innerHTML = '<p style="text-align:center; padding:2rem; opacity:0.5;">Eşleşme bulunamadı...</p>';
        return;
    }

    data.forEach(item => {
        // 1. Kategori Ayıklama (Sadece 'Genel' olmayanları göster)
        const kategori = (item.kategori && item.kategori !== 'Genel') ? item.kategori : null;
        
        // 2. Renk Ayarları
        let catColor = '#f1f5f9';
        let textColor = '#475569';
        
        if (kategori) {
            if (kategori.includes('Tıp')) { catColor = '#fee2e2'; textColor = '#991b1b'; }
            else if (kategori.includes('Mitoloji')) { catColor = '#fef3c7'; textColor = '#92400e'; }
            else if (kategori.includes('Denizcilik')) { catColor = '#e0f2fe'; textColor = '#0369a1'; }
            else if (kategori.includes('Tarih')) { catColor = '#f0fdf4'; textColor = '#166534'; }
        }

        // 3. Kartı Oluşturma
        const d = document.createElement('div');
        d.className = 'word-card';
        
        // Eğer kategori varsa span'i oluştur, yoksa boş bırak
        const categoryHTML = kategori 
            ? `<span style="background:${catColor}; color:${textColor}; padding:4px 10px; border-radius:6px; font-size:0.65rem; font-weight:700; text-transform:uppercase; border:1px solid rgba(0,0,0,0.05);">${kategori}</span>`
            : '';

        d.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                <small style="color:#64748b; font-weight:800; text-transform:uppercase; font-size:0.65rem; letter-spacing:0.5px;">Soru / Tanım</small>
                ${categoryHTML}
            </div>
            <div style="display:flex; flex-direction:column; gap:8px;">
                <p style="margin:2px 0; font-size:1.05rem; color:#1e293b; line-height:1.5;">${item.anlam}</p>
                <div style="border-top: 1px solid #f1f5f9; padding-top:12px; margin-top:4px;">
                    <small style="color:#2563eb; font-weight:800; text-transform:uppercase; font-size:0.65rem; letter-spacing:0.5px;">Cevap</small>
                    <h2 style="margin:2px 0; letter-spacing:1.5px; color:#0f172a; font-size:1.5rem; font-weight:800;">${item.kelime}</h2>
                </div>
            </div>
        `;
        res.appendChild(d);
    });
}
