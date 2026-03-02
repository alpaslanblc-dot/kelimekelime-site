// Kategori kısmını şu şekilde güncelle:
const kategoriText = (item.kategori && item.kategori !== 'Genel') ? item.kategori : '';

// HTML içindeki span kısmını da şöyle değiştir:
${kategoriText ? `<span style="background:${catColor}; color:${textColor}; padding:4px 10px; border-radius:6px; font-size:0.65rem; font-weight:700; text-transform:uppercase; border:1px solid rgba(0,0,0,0.05);">${kategoriText}</span>` : ''}
