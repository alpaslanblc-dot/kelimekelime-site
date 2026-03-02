function render(data) {
    const res = document.getElementById('results');
    if(!res) return;
    res.innerHTML = '';

    if (!data || data.length === 0) {
        res.innerHTML = '<p style="text-align:center; padding:2rem; opacity:0.5;">Eşleşme bulunamadı...</p>';
        return;
    }

    data.forEach(item => {
        // Kategoriye göre renk belirleme (isteğe bağlı)
        const catColor = item.kategori === 'Tıp ve Sağlık' ? '#fee2e2' : 
                         item.kategori === 'Mitoloji ve İnanç' ? '#fef3c7' : 
                         item.kategori === 'Denizcilik' ? '#e0f2fe' : '#f1f5f9';
        
        const textColor = item.kategori === 'Tıp ve Sağlık' ? '#991b1b' : 
                          item.kategori === 'Mitoloji ve İnanç' ? '#92400e' : 
                          item.kategori === 'Denizcilik' ? '#0369a1' : '#475569';

        const d = document.createElement('div');
        d.className = 'word-card';
        // Kategori etiketini sağ üste ekledik
        d.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:10px;">
                <small style="color:#64748b; font-weight:800; text-transform:uppercase; font-size:0.7rem;">Soru / Tanım</small>
                <span style="background:${catColor}; color:${textColor}; padding:3px 8px; border-radius:6px; font-size:0.65rem; font-weight:700; text-transform:uppercase; border:1px solid rgba(0,0,0,0.05);">
                    ${item.kategori || 'Genel'}
                </span>
            </div>
            <div style="display:flex; flex-direction:column; gap:8px;">
                <div>
                    <p style="margin:2px 0; font-size:1.05rem; color:#1e293b;">${item.anlam}</p>
                </div>
                <div style="border-top: 1px solid #f1f5f9; padding-top:10px;">
                    <small style="color:#2563eb; font-weight:800; text-transform:uppercase; font-size:0.7rem;">Cevap</small>
                    <h2 style="margin:2px 0; letter-spacing:1px; color:#0f172a; font-size:1.4rem;">${item.kelime}</h2>
                </div>
            </div>
        `;
        res.appendChild(d);
    });
}
