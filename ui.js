// Render alanı referansı
const view = document.getElementById('viewArea');

// Menü ve Modal Yapısını Enjekte Et
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
        <div style="background:white; width:90%; max-width:500px; padding:30px; border-radius:20px; position:relative; max-height:80vh; overflow-y:auto; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);">
            <button onclick="closeModal()" style="position:absolute; top:15px; right:15px; border:none; background:none; font-size:1.8rem; cursor:pointer; color:var(--m);">&times;</button>
            <div id="modalContent"></div>
        </div>
    </div>
`);

// Navbar Logosunu ve Butonunu Güncelle
const navbar = document.querySelector('.navbar');
if(navbar) {
    navbar.innerHTML = `
        <a href="/" class="logo" style="text-decoration:none; display:flex; align-items:center; gap:8px;">
            <span style="font-size:1.8rem;">🧩</span> 
            <div style="display:flex; flex-direction:column; line-height:1;">
                <span style="font-size:1.2rem; font-weight:800; color:var(--t);">KELİME</span>
                <span style="font-size:0.9rem; font-weight:700; color:var(--p); letter-spacing:1px;">BULMACA</span>
            </div>
        </a>
        <button class="menu-btn" onclick="toggleMenu()" style="background:none; border:none; font-size:1.8rem; cursor:pointer; color:var(--t);">☰</button>
    `;
}

// Menü Fonksiyonları
function toggleMenu() {
    document.getElementById('sideMenu').classList.toggle('active');
    document.getElementById('overlay').classList.toggle('active');
}
document.getElementById('overlay').onclick = toggleMenu;

function openModal(html) {
    document.getElementById('modalContent').innerHTML = html;
    document.getElementById('customModal').style.display = 'flex';
    if(document.getElementById('sideMenu').classList.contains('active')) toggleMenu();
}

function closeModal() {
    document.getElementById('customModal').style.display = 'none';
}

// Önerileri Veritabanına Gönderen Fonksiyon (submitSuggestion)
async function submitSuggestion() {
    const k = document.getElementById('sugK').value;
    const a = document.getElementById('sugA').value;
    
    if(!k || !a) return alert("Lütfen tüm alanları doldurun.");

    try {
        // database.js'deki ismi ne olursa olsun otomatik yakalar
        const db = window.supabase || (typeof _db !== 'undefined' ? _db : null);
        
        const { error } = await db.from('oneriler').insert([{ kelime: k, anlam: a }]);
        
        if (error) throw error;

        alert("🧩 Harika! Öneriniz başarıyla kuyruğa alındı. Teşekkürler!");
        closeModal();
    } catch (err) {
        console.error("Hata:", err);
        alert("Gönderim sırasında bir sorun oluştu. Lütfen SQL RLS ayarlarını kontrol edin.");
    }
}

// İçerik Fonksiyonları
function showPrivacy() {
    openModal(`
        <h2 style="margin-bottom:15px; color:var(--p); display:flex; align-items:center; gap:10px;">🛡️ Gizlilik Politikası</h2>
        <p style="color:var(--m); font-size:0.95rem; line-height:1.6;">KelimeBulmaca.com olarak kullanıcı verilerinin güvenliği önceliğimizdir. Sitemizde tutulan bilgiler sadece kullanıcı deneyimini iyileştirmek ve anonim analizler yapmak amacıyla kullanılır. Üçüncü şahıslarla asla paylaşılmaz.</p>
    `);
}

function showContact() {
    openModal(`
        <h2 style="margin-bottom:15px; color:var(--p); display:flex; align-items:center; gap:10px;">📧 İletişim</h2>
        <p style="margin-bottom:15px;">Görüş, öneri veya telif bildirimleri için bize e-posta yoluyla ulaşabilirsiniz:</p>
        <div style="background:var(--pl); padding:15px; border-radius:12px; text-align:center;">
            <a href="mailto:iletisim@kelimebulmaca.com" style="color:var(--p); font-weight:800; text-decoration:none; font-size:1.2rem;">iletisim@kelimebulmaca.com</a>
        </div>
    `);
}

function showSuggest() {
    openModal(`
        <h2 style="margin-bottom:15px; color:var(--p); display:flex; align-items:center; gap:10px;">🧩 Yeni Kelime Öner</h2>
        <p style="margin-bottom:20px; font-size:0.9rem; color:var(--m);">Veritabanımızda olmayan bir kelimeyi anlamıyla birlikte gönderin, incelendikten sonra yayınlayalım.</p>
        <div style="display:flex; flex-direction:column; gap:12px;">
            <input type="text" id="sugK" placeholder="Örn: Zeytin" style="width:100%; padding:14px; border:2px solid var(--b); border-radius:12px; outline:none; font-size:1rem;">
            <textarea id="sugA" placeholder="Kelimenin anlamı veya bulmaca sorusu..." style="width:100%; padding:14px; border:2px solid var(--b); border-radius:12px; height:120px; outline:none; font-family:inherit; font-size:1rem;"></textarea>
            <button onclick="submitSuggestion()" style="width:100%; padding:16px; background:var(--p); color:white; border:none; border-radius:12px; font-weight:800; cursor:pointer; font-size:1rem; transition:0.2s;">GÖNDER</button>
        </div>
    `);
}

// İçerik Listeleme Motoru
function renderWords(data, title) {
    const v = document.getElementById('viewArea');
    if(!v) return;

    v.innerHTML = `<h3 style="margin-bottom:20px; color:var(--m); font-size:0.85rem; text-transform:uppercase; letter-spacing:1px;">${title}</h3>`;
    
    if (!data || data.length === 0) {
        v.innerHTML += `<div class="card" style="text-align:center; padding:40px; color:var(--m);">Üzgünüz, aradığınız kriterlere uygun sonuç bulamadık. 🧩</div>`;
        return;
    }

    data.forEach((item, index) => {
        if (index > 0 && index % 4 === 0) {
            v.innerHTML += `<div class="ad-box" style="padding:30px; background:var(--pl); border:2px dashed var(--b); border-radius:20px; text-align:center; margin-bottom:25px; font-size:0.8rem; color:var(--p); font-weight:700;">REKLAM ALANI</div>`;
        }

        const card = document.
