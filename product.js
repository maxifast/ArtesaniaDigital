document.addEventListener('DOMContentLoaded', () => {
    // 1. Get Product ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));

    // 2. Load Product Data
    const products = window.appProducts || [];
    // Fallback to first product if no valid ID is found
    const product = products.find(p => p.id === productId) || products[0];

    // 3. Populate Document Info
    document.title = `${product.title} — Artesanía Digital`;

    // 4. Populate Hero Text
    document.querySelector('.pro-title').textContent = product.title;
    document.querySelector('.pro-price').innerHTML = `€${product.price} <span class="currency">EUR</span>`;
    document.querySelector('.pro-description').textContent = product.story;

    // Meta Information
    const metaContainer = document.querySelector('.pro-meta');
    if (metaContainer) {
        metaContainer.innerHTML = `
          <div class="meta-item"><span>Artesano:</span> ${product.artisan}</div>
          <div class="meta-item"><span>Región:</span> ${product.region}</div>
          <div class="meta-item"><span>Tiempo de entrega:</span> 3-5 días hábiles</div>
      `;
    }

    // 5. Populate Alma del Maestro Section
    const quoteEl = document.querySelector('.alma-quote');
    const authorEl = document.querySelector('.alma-author');
    if (quoteEl && authorEl) {
        quoteEl.textContent = product.quote.replace(/«|»/g, ''); // Remove guillemets
        authorEl.textContent = `— ${product.artisan}`;
    }

    // 6. Populate Specifications
    const specsTable = document.querySelector('.specs-table');
    if (specsTable) {
        let labels = ['Material / Técnica', 'Acabado / Característica', 'Uso / Dimensiones', 'Cuidados / Otros'];
        // Generate rows based on the number of details available for the product
        const specsHtml = product.details.map((detail, index) => {
            const label = labels[index] || 'Detalle Adicional';
            return `
            <div class="spec-row">
                <div class="spec-label">${label}</div>
                <div class="spec-value">${detail}</div>
            </div>`;
        }).join('');
        specsTable.innerHTML = specsHtml;
    }

    // 7. Gallery Logic (Main Image + 3 Thumbnails)
    const mainImage = document.querySelector('.pro-main-image');
    const thumbsContainer = document.querySelector('.pro-thumbnails');

    if (mainImage && thumbsContainer) {
        // Set main image
        mainImage.src = product.img;
        mainImage.alt = product.title;

        // Determine base path for additional images (e.g., product-vase1.png)
        const extMatch = product.img.match(/\.([a-z0-9]+)$/i);
        const ext = extMatch ? extMatch[0] : '';
        const base = product.img.slice(0, -ext.length);

        // Clear existing static thumbnails
        thumbsContainer.innerHTML = '';

        // Add the primary image as the first thumbnail (active)
        let thumbsHtml = `<img src="${product.img}" alt="${product.title} Principal" class="active">`;

        // Add 3 detail images based on the naming convention (e.g., product-vase1.png, product-vase2.png)
        for (let i = 1; i <= 3; i++) {
            const detailImg = `${base}${i}${ext}`;
            // We use onerror to hide the thumbnail if the specific product doesn't have 3 extra images yet
            thumbsHtml += `<img src="${detailImg}" alt="Detalle ${i}" onerror="this.style.display='none'">`;
        }

        thumbsContainer.innerHTML = thumbsHtml;

        // Add click event to thumbnails to change logic
        const thumbnails = thumbsContainer.querySelectorAll('img');
        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', function () {
                // Update active state
                thumbnails.forEach(t => t.classList.remove('active'));
                this.classList.add('active');

                // Change main image smoothly
                mainImage.style.opacity = '0';
                setTimeout(() => {
                    mainImage.src = this.src;
                    mainImage.style.opacity = '1';
                }, 200);
            });
        });
    }
});
