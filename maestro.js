/**
 * Maestro Profile Page - Dynamic Rendering
 * Reads ?id= from URL, loads artisan from MaestrosData, renders profile + works.
 */

document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const maestroId = params.get('id');

    if (!maestroId || !window.MaestrosData) {
        showError();
        return;
    }

    const maestro = window.MaestrosData.getById(maestroId);
    if (!maestro) {
        showError();
        return;
    }

    // Populate page
    document.title = `${maestro.name} | Artesanía Digital`;

    const el = (id) => document.getElementById(id);

    // Avatar
    const avatar = el('mAvatar');
    if (avatar) avatar.textContent = maestro.initials || maestro.name.split(' ').map(w => w[0]).join('');

    // Name
    const name = el('mName');
    if (name) name.textContent = maestro.name;

    // Region
    const region = el('mRegion');
    if (region) {
        const svg = region.querySelector('svg');
        region.textContent = '';
        if (svg) region.appendChild(svg);
        region.appendChild(document.createTextNode(' ' + (maestro.region || '')));
    }

    // Specialty
    const specialty = el('mSpecialty');
    if (specialty) specialty.textContent = maestro.specialty || '';

    // Status
    const status = el('mStatus');
    if (status) {
        const dot = status.querySelector('.status-dot');
        if (maestro.online) {
            if (dot) dot.classList.add('online');
            status.childNodes.forEach(n => { if (n.nodeType === 3) n.textContent = ' En el taller ahora'; });
        } else {
            if (dot) dot.classList.remove('online');
            status.childNodes.forEach(n => { if (n.nodeType === 3) n.textContent = ' Fuera del taller'; });
        }
    }

    // Bio
    const bio = el('mBio');
    if (bio) bio.textContent = maestro.bio || '';

    // Quote
    const quote = el('mQuote');
    if (quote) quote.textContent = maestro.quote || '';

    // Image
    const img = el('mImage');
    if (img && maestro.img) img.src = maestro.img;

    // Works
    renderWorks(maestro);
});

function renderWorks(maestro) {
    const grid = document.getElementById('mWorksGrid');
    const empty = document.getElementById('mWorksEmpty');
    if (!grid) return;

    // Get catalog products assigned to this artisan
    let products = [];
    if (window.MaestrosData) {
        products = window.MaestrosData.getProducts(maestro.id);
    }

    // Also check for dashboard-created products not yet assigned
    try {
        const saved = localStorage.getItem('artesano_products');
        if (saved) {
            const dashProducts = JSON.parse(saved);
            // Include all dashboard products if this is the "default" artisan (maria-ruiz)
            // or products explicitly assigned to this artisan
            const unassigned = dashProducts.filter(p =>
                !p.artisanId || p.artisanId === maestro.id
            );
            if (maestro.id === 'maria-ruiz') {
                // Default artisan gets unassigned products
                products = [...products, ...unassigned.filter(p => !products.find(ep => ep.id === p.id))];
            }
        }
    } catch (e) { }

    if (products.length === 0) {
        grid.style.display = 'none';
        if (empty) empty.style.display = 'block';
        return;
    }

    grid.innerHTML = products.map(p => `
        <a href="product.html?id=${p.id}" class="maestro-work-card">
            <div class="maestro-work-img-wrap">
                <img src="${p.img || p.image || 'assets/images/product-vase.png'}" alt="${p.title || p.name}" onerror="this.src='assets/images/product-vase.png'">
            </div>
            <div class="maestro-work-info">
                <h4>${p.title || p.name || 'Obra sin título'}</h4>
                <div class="maestro-work-price">€${p.price || 0}</div>
            </div>
        </a>
    `).join('');
}

function showError() {
    const hero = document.getElementById('maestroHero');
    if (hero) {
        hero.innerHTML = `
            <div class="container" style="text-align:center; padding: 4rem 1rem;">
                <h1>Maestro no encontrado</h1>
                <p style="color:var(--color-text-light); margin-top:1rem;">Este perfil no existe o aún no se ha registrado.</p>
                <a href="index.html#maestros" class="btn btn-outline" style="margin-top:2rem; display:inline-flex;">Ver Todos los Maestros</a>
            </div>
        `;
    }
}
