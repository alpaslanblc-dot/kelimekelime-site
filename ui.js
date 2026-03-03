// Render alanı
const view = document.getElementById('viewArea');

// Menü ve Modalları Sayfaya Bas
document.body.insertAdjacentHTML('beforeend', `
    <div class="overlay" id="overlay"></div>
    <div class="side-menu" id="sideMenu">
        <div class="menu-section">
            <h4>Kategoriler</h4>
            <div id="menuCats"></div>
        </div>
        <div class="menu-section">
            <h4>Kurumsal</h4>
            <a class="menu-link" onclick="showSuggest()">🧩 Kelime Öner</a>
            <a class="menu-link" onclick="showContact()">📧 İletişim</a>
            <a class="menu-link" onclick="showPrivacy()">🛡️ Gizlilik Politikası</a>
        </div>
    </div>
    <div id="customModal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.6); z-index:3000; align-items:center; justify-content:center; backdrop-filter:blur(5px);">
        <div style="background:white; width:90%; max-width:500px; padding:30px; border-radius:20px; position:relative; max-height:80vh; overflow-y:auto;">
            <button onclick="closeModal()" style="position:absolute; top:15px; right:15px; border:none; background:none; font-size:1.8rem; cursor:pointer;">&times;</button>
            <div id="modalContent"></div>
        </div>
    </div>
`);

// Navbar Güncelleme
document.querySelector('.navbar').innerHTML = `
    <a href="/" class="logo" style="text-decoration:none; display:flex; align-items:center; gap:8px;">
        <span style="font-size:1.8rem;">🧩</span> 
        <div style="display:flex; flex-direction:column; line-height:1;">
            <span style="font-size:1.2rem; font-weight:800; color:#1e293b;">KELİME</span>
            <span style="font-size:0.9rem; font-weight:700; color:#4f46e5; letter-spacing:1px;">BULMACA</span>
        </div>
    </a>
    <button class="menu-btn" onclick="toggleMenu()" style="background:none; border:none; font-size:1.8rem; cursor:pointer;">☰</button>
`;

function toggleMenu() {
    document.getElementById('sideMenu').classList.toggle('active');
    document.getElementById('overlay').classList.toggle('active');
}
document.getElementById('overlay').onclick = toggleMenu;

function closeModal() { document.getElementById('customModal').style.display = 'none'; }

function openModal(html) {
    document.getElementById('modalContent').innerHTML = html;
    document.getElementById('customModal').style.display = 'flex';
    if(document.getElementById('sideMenu').classList.contains('active')) toggleMenu();
}

// Öneri Gönder (Hata payı sıfırlandı)
async function submitSuggestion() {
    const k = document.getElementById('sugK').value;
    const a = document.getElementById('sugA').value;
    if(!k || !a) return alert("Boş bırakmayın.");

    const { error } = await _db.from('oneriler').insert([{ kelime: k, anlam: a }]);
    if (error) { alert("Hata! SQL RLS ayarını kontrol edin."); } 
    else { alert("Öneriniz alındı!"); closeModal(); }
}

function showPrivacy() { openModal(`<h2>🛡️ Gizlilik</h2><p>Verileriniz bizimle güvende.</p>`); }
function showContact() { openModal(`<h2>📧 İletişim</h2><p>iletisim@kelimebulmaca.com</p>`); }
function showSuggest() {
    openModal(`
        <h2>🧩 Kelime Öner</h2>
        <input type="text" id="sugK" placeholder="Kelime" style="width:100%; padding:12px; margin:10px 0; border:1px solid #ddd; border-radius:10px;">
        <textarea id="sugA" placeholder="Anlamı" style="width:100%; padding:12px; margin-bottom:10px; border:1px solid #ddd; border-radius:10px; height:100px;"></textarea>
        <button onclick="submitSuggestion()" style="width:100%; padding:15px; background:#4f46e5; color:white; border:none; border-radius:10px; font-weight:bold; cursor:pointer;">GÖNDER</button>
    `);
}

function renderWords(data, title) {
    view.innerHTML = `<h3 style="margin-bottom:20px; color:#64748b; font-size:0.85rem; text-transform:uppercase;">${title}</h3>`;
    if (!data || data.length === 0) { view.innerHTML += `<p>Sonuç yok.</p>`; return; }

    data.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <span style="background:#eef2ff; color:#4f46e5; padding:4px 10px; border-radius:8px; font-size:0.7rem; font-weight:800;">${item.kategori || 'Genel'}</span>
            <p style="font-size:1.2rem; margin:15px 0; color:#1e293b;">${item.anlam}</p>
            <h2 style="color:#4f46e5; font-size:1.6rem;">${item.kelime.toUpperCase()}</h2>
        `;
        view.appendChild(card);
    });
}

// Kategoriler
const categories = ["Tarih", "Sanat", "İnanç", "Doğa", "Tıp", "Siyaset", "Spor"];
const menuCatArea = document.getElementById('menuCats');
categories.forEach(c => {
    const link = document.createElement('a');
    link.className = 'menu-link';
    link.innerText = c;
    link.onclick = async () => {
        const { data } = await getWords({ column: 'kategori', value: c });
        renderWords(data, `${c} Kategorisi`);
        toggleMenu();
    };
    menuCatArea.appendChild(link);
});
