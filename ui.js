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
            <a class="menu-link" onclick="showSuggest()">💡 Kelime Öner</a>
            <a class="menu-link" onclick="showContact()">📧 İletişim</a>
            <a class="menu-link" onclick="showPrivacy()">🛡️ Gizlilik Politikası</a>
        </div>
    </div>
    <div id="customModal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.6); z-index:3000; align-items:center; justify-content:center; backdrop-filter:blur(5px);">
        <div style="background:white; width:90%; max-width:500px; padding:30px; border-radius:20px; position:relative; max-height:80vh; overflow-y:auto;">
            <button onclick="closeModal()" style="position:absolute; top:15px; right:15px; border:none; background:none; font-size:1.5rem; cursor:pointer;">&times;</button>
            <div id="modalContent"></div>
        </div>
    </div>
`);

// Navbar'a Hamburger Butonu Ekle
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

// Modal Fonksiyonları
function openModal(html) {
    document.getElementById('modalContent').innerHTML = html;
    document.getElementById('customModal').style.display = 'flex';
    if(document.getElementById('sideMenu').classList.contains('active')) toggleMenu();
}

function closeModal() {
    document.getElementById('customModal').style.display = 'none';
}

function showPrivacy() {
    openModal(`
        <h2 style="margin-bottom:15px; color:var(--p);">Gizlilik Politikası</h2>
        <p style="font-size:0.9rem; color:var(--m); line-height:1.5;">KelimeKelime olarak kullanıcı gizliliğine önem veriyoruz. Sitemizde toplanan veriler sadece kullanıcı deneyimini iyileştirmek ve anonim istatistikler tutmak içindir. Google AdSense reklamları çerezler kullanabilir.</p>
    `);
}

function showContact() {
    openModal(`
        <h2 style="margin-bottom:15px; color:var(--p);">İletişim</h2>
        <p style="margin-bottom:10px;">Sorularınız ve iş birliği için bize ulaşın:</p>
        <a href="mailto:iletisim@kelimekelime.com" style="color:var(--p); font-weight:bold; text-decoration:none; font-size:1.1rem;">iletisim@kelimekelime.com</a>
    `);
}

function showSuggest() {
    openModal(`
        <h2 style="margin-bottom:15px; color:var(--p);">Kelime Öner</h2>
        <p style="margin-bottom:15px; font-size:0.9rem; color:var(--m);">Sözlüğümüzde olmayan bir kelimeyi bize gönderin, ekleyelim!</p>
        <input type="text" id="sugK" placeholder="Kelime" style="width:100%; padding:12px; margin-bottom:10px; border:1px solid var(--b); border-radius:10px; outline:none;">
        <textarea id="sugA" placeholder="Anlamı" style="width:100%; padding:12px; margin-bottom:10px; border:1px solid var(--b); border-radius:10px; height:100px; outline:none; font-family:inherit;"></textarea>
        <button onclick="submitSuggestion()" style="width:100%; padding:14px; background:var(--p); color:white; border:none; border-radius:10px; font-weight:bold; cursor:pointer;">GÖNDER</button>
    `);
}

// Kelime Kartlarını Ekrana Basan Ana Fonksiyon
function renderWords(data, title) {
    const view = document.getElementById('viewArea');
    if(!view) return;

    view.innerHTML = `<h3 style="margin-bottom:20px; color:var(--m); font-size:0.9rem; text-transform:uppercase;">${title}</h3>`;
    
    if (!data || data.length === 0) {
        view.innerHTML += `<div class="card">Sonuç bulunamadı. Lütfen başka bir arama yapın.</div>`;
        return;
    }

    data.forEach((item, index) => {
        // Her 4 kartta bir reklam alanı
        if (index > 0 && index % 4 === 0) {
            view.innerHTML += `<div class="ad-box" style="padding:20px; background:#e2e8f0; border-radius:15px; text-align:center; margin-bottom:20px; font-size:0.8rem; color:var(--m); border: 1px dashed var(--b);">REKLAM ALANI</div>`;
        }

        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div style="display:flex; justify-content:space-between;">
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
