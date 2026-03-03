// Render alanı referansı
const view = document.getElementById('viewArea');

// Menü Elemanlarını Enjekte Et
document.body.insertAdjacentHTML('beforeend', `
    <div class="overlay" id="overlay"></div>
    <div class="side-menu" id="sideMenu">
        <div class="menu-section">
            <h4>Kategoriler</h4>
            <div id="menuCats"></div>
        </div>
        <div class="menu-section">
            <h4>Kurumsal</h4>
            <a class="menu-link" onclick="toggleMenu()">💡 Kelime Öner</a>
            <a class="menu-link" onclick="toggleMenu()">📧 İletişim</a>
            <a class="menu-link" onclick="toggleMenu()">🛡️ Gizlilik Politikası</a>
        </div>
    </div>
`);

// Navbar'a Hamburger Butonu Ekle (Eski butonları temizleyerek)
const navAction = document.createElement('button');
navAction.className = 'menu-btn';
navAction.style = "background:none; border:none; font-size:1.8rem; cursor:pointer;";
navAction.innerHTML = '☰';
navAction.onclick = toggleMenu;
document.querySelector('.navbar').appendChild(navAction);

function toggleMenu() {
    document.getElementById('sideMenu').classList.toggle('active');
    document.getElementById('overlay').classList.toggle('active');
}
document.getElementById('overlay').onclick = toggleMenu;

// Kelime Kartlarını Ekrana Basan Ana Fonksiyon
function renderWords(data, title) {
    view.innerHTML = `<h3 style="margin-bottom:20px; color:var(--m); font-size:0.9rem; text-transform:uppercase;">${title}</h3>`;
    
    if (!data || data.length === 0) {
        view.innerHTML += `<div class="card">Aradığınız kriterlere uygun kelime bulunamadı.</div>`;
        return;
    }

    data.forEach((item, index) => {
        if (index > 0 && index % 4 === 0) {
            view.innerHTML += `<div class="ad-box" style="padding:20px; background:#e2e8f0; border-radius:15px; text-align:center; margin-bottom:20px; font-size:0.8rem; color:var(--m);">REKLAM ALANI</div>`;
        }

        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                <span style="background:var(--pl); color:var(--p); padding:4px 10px; border-radius:8px; font-size:0.7rem; font-weight:800;">${item.kategori || 'Genel'}</span>
            </div>
            <p style="font-size:1.2rem; margin:15px 0; color:var(--t); font-weight:500;">${item.anlam}</p>
            <div style="border-top:1px solid var(--b); padding-top:15px;">
                <h2 style="letter-spacing:1px; color:var(--p); font-size:1.6rem;">${item.kelime.toUpperCase()}</h2>
            </div>
        `;
        view.appendChild(card);
    });
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
