// Menü HTML'ini sayfaya enjekte et (index.html'i kirletmeden)
document.body.insertAdjacentHTML('beforeend', `
    <div class="overlay" id="overlay"></div>
    <div class="side-menu" id="sideMenu">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:30px;">
            <h2 style="font-weight:800;">Menü</h2>
            <button onclick="toggleMenu()" style="border:none; background:none; font-size:1.5rem; cursor:pointer;">&times;</button>
        </div>
        
        <div class="menu-section">
            <h4>Kategoriler</h4>
            <div id="menuCats"></div>
        </div>

        <div class="menu-section">
            <h4>Topluluk</h4>
            <a class="menu-link" onclick="showPopup('öneri')">💡 Kelime Öner</a>
            <a class="menu-link" onclick="showPopup('iletişim')">📧 İletişim</a>
        </div>

        <div class="menu-section">
            <h4>Yasal</h4>
            <a class="menu-link" onclick="showPopup('gizlilik')">🛡️ Gizlilik Politikası</a>
            <a class="menu-link" onclick="showPopup('hizmet')">📜 Kullanım Şartları</a>
        </div>
    </div>
`);

// Hamburger butonunu Navbar'a ekle
document.querySelector('.navbar').innerHTML += `<button class="menu-btn" onclick="toggleMenu()">☰</button>`;

function toggleMenu() {
    document.getElementById('sideMenu').classList.toggle('active');
    document.getElementById('overlay').classList.toggle('active');
}

document.getElementById('overlay').onclick = toggleMenu;

// Profesyonel Protokol Popup'ları (Statik Sayfalar Yerine Pratik Çözüm)
function showPopup(type) {
    toggleMenu();
    let content = {
        'gizlilik': "Gizlilik Politikası: Verileriniz üçüncü taraflarla paylaşılmaz...",
        'iletişim': "Bize ulaşın: iletisim@kelimekelime.com",
        'öneri': "Önerdiğiniz kelimeyi ve anlamını bize yazın!",
        'hizmet': "Hizmet Şartları: Bu site bilgi amaçlıdır..."
    };
    alert(content[type]); // Şimdilik alert, ilerde şık bir modal yaparız.
}

// Kategorileri Menüye Doldur
const categories = ["Tarih", "Sanat", "İnanç", "Doğa", "Tıp", "Siyaset", "Spor"];
const menuCatArea = document.getElementById('menuCats');
categories.forEach(c => {
    const link = document.createElement('a');
    link.className = 'menu-link';
    link.innerText = c;
    link.onclick = async () => {
        toggleMenu();
        const { data } = await getWords({ column: 'kategori', value: c });
        renderWords(data, `${c} Kategorisi`);
    };
    menuCatArea.appendChild(link);
});

// Render fonksiyonu zaten önceki ui.js içinde vardı, onu koruyoruz.
