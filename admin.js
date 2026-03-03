function checkAdminStatus() {
    return new URLSearchParams(window.location.search).get('admin') === '1';
}

if (checkAdminStatus()) {
    const container = document.getElementById('adminContainer');
    container.innerHTML = `
        <div class="admin-form">
            <h3>Yönetici Paneli</h3>
            <input type="text" id="admK" placeholder="Kelime">
            <input type="text" id="admC" placeholder="Kategori">
            <textarea id="admA" placeholder="Anlam"></textarea>
            <button onclick="handleSave()" style="width:100%; padding:10px; background:var(--p); color:white; border:none; cursor:pointer;">KAYDET</button>
        </div>
    `;
}

async function handleSave() {
    const obj = {
        kelime: document.getElementById('admK').value,
        kategori: document.getElementById('admC').value,
        anlam: document.getElementById('admA').value
    };
    const { error } = await addWord(obj);
    if (error) alert(error.message);
    else location.reload();
}

async function handleDelete(id) {
    if (confirm('Silmek istediğine emin misin?')) {
        await deleteWord(id);
        location.reload();
    }
}