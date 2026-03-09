/* ============================================================
   CATALOG — "The Artisan's Journal"
   30 Products, Expanding Cards, Load-More Pagination
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ================================================
     PRODUCT DATA — Loaded from data.js
     ================================================ */
  const products = window.appProducts || [];

  /* ================================================
     STATE
     ================================================ */
  const ITEMS_PER_PAGE = 9;
  let currentPage = 1;
  let currentFilter = 'all';
  let expandedCardId = null;

  const grid = document.getElementById('journalGrid');
  const loadMoreBtn = document.getElementById('loadMoreBtn');
  const loadMoreWrap = document.getElementById('loadMoreWrap');
  const loadMoreCount = document.getElementById('loadMoreCount');
  const resultCount = document.getElementById('resultCount');

  /* ================================================
     RENDER CARD HTML
     ================================================ */
  const renderCard = (p) => {
    const extMatch = p.img.match(/\.([a-z0-9]+)$/i);
    const ext = extMatch ? extMatch[0] : '';
    const base = p.img.slice(0, -ext.length);

    const polaroidHtml = p.polaroids.map((cap, i) => {
      const parts = cap.split(' ');
      const emoji = parts[0];
      const label = parts.slice(1).join(' ');
      const detailImg = `${base}${i + 1}${ext}`;
      return `<div class="j-polaroid">
                <img class="j-polaroid-img js-zoom-img" src="${detailImg}" alt="${label}" loading="lazy" onerror="this.outerHTML='<div class=\\'j-polaroid-img\\'>${emoji}</div>'">
                <div class="j-polaroid-caption">${label}</div>
              </div>`;
    }).join('');

    const detailChips = p.details.map(d => `<span class="j-detail-chip">${d}</span>`).join('');

    const artisanId = p.artisan.toLowerCase().replace(/\s+/g, '-').normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    return `
    <article class="j-card hidden" data-id="${p.id}" data-cat="${p.cat}" data-artisan-id="${artisanId}">
      <div class="j-card-image">
        <a href="product.html?id=${p.id}">
          <img src="${p.img}" alt="${p.title}" loading="lazy">
        </a>
        <span class="j-badge">${p.badge}</span>
        <button class="j-wish" aria-label="Favorito">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
        </button>
      </div>
      <div class="j-body">
        <a href="maestro.html?id=${artisanId}" class="j-artisan-row" style="text-decoration:none; color:inherit;">
          <div class="j-artisan-avatar">${p.initials}</div>
          <span class="j-artisan-name">${p.artisan}</span>
          ${p.live ? '<div class="j-live-dot" title="En el taller ahora"></div>' : ''}
        </a>
        <h3 class="j-title"><a href="product.html?id=${p.id}">${p.title}</a></h3>
        <div class="j-region">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
          ${p.region}
        </div>
        <div class="j-quote">${p.quote}</div>
        <div class="j-footer">
          <span class="j-price">€${p.price}</span>
          <button class="j-cart" aria-label="Añadir al carrito">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          </button>
        </div>
        <div class="j-expand-hint" data-toggle="${p.id}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
          Leer la historia del artesano
        </div>
      </div>
      <!-- EXPANDING PANEL -->
      <div class="j-expand">
        <div class="j-polaroids">${polaroidHtml}</div>
        <p class="j-story">${p.story}</p>
        <div class="j-details">${detailChips}</div>
        <a href="product.html?id=${p.id}" class="btn btn-outline" style="width:100%; text-align:center; margin-top:1rem; color:var(--color-primary); border-color:var(--color-border);">Ver Toda la Información</a>
      </div>
    </article>`;
  };

  /* ================================================
     INITIAL RENDER
     ================================================ */
  const allCardsHtml = products.map(p => renderCard(p)).join('');
  grid.innerHTML = allCardsHtml;

  /* ================================================
     SHOW / HIDE LOGIC
     ================================================ */
  const getFilteredCards = () => {
    const all = Array.from(grid.querySelectorAll('.j-card'));
    const params = new URLSearchParams(window.location.search);
    const categoryFilterParam = params.get('cat');
    const artisanFilterParam = params.get('artisan');

    let filteredCards = all;

    if (categoryFilterParam) {
      filteredCards = filteredCards.filter(c => c.dataset.cat === categoryFilterParam);
      // Deactivate all filter chips and activate the one matching the URL param
      document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
      const matchingChip = document.querySelector(`.filter-chip[data-filter="${categoryFilterParam}"]`);
      if (matchingChip) {
        matchingChip.classList.add('active');
        currentFilter = categoryFilterParam; // Update internal state
      }
    } else if (artisanFilterParam) {
      filteredCards = filteredCards.filter(c => c.dataset.artisanId === artisanFilterParam);
      // If filtering by artisan, ensure no category chip is active
      document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
      currentFilter = 'all'; // Reset internal category filter state
    } else if (currentFilter !== 'all') {
      filteredCards = filteredCards.filter(c => c.dataset.cat === currentFilter);
    }

    return filteredCards;
  };

  const showPage = () => {
    const filtered = getFilteredCards();
    const totalFiltered = filtered.length;
    const toShow = currentPage * ITEMS_PER_PAGE;

    // Hide all first
    grid.querySelectorAll('.j-card').forEach(c => {
      c.classList.add('hidden');
      c.classList.remove('fade-in');
    });

    // Show visible
    filtered.forEach((card, i) => {
      if (i < toShow) {
        card.classList.remove('hidden');
        if (i >= toShow - ITEMS_PER_PAGE) {
          card.classList.add('fade-in');
        }
      }
    });

    // Update counter
    const shown = Math.min(toShow, totalFiltered);
    loadMoreCount.textContent = `Mostrando ${shown} de ${totalFiltered}`;
    resultCount.textContent = `${totalFiltered} pieza${totalFiltered !== 1 ? 's' : ''} única${totalFiltered !== 1 ? 's' : ''}`;

    // Toggle button
    if (shown >= totalFiltered) {
      loadMoreWrap.style.display = 'none';
    } else {
      loadMoreWrap.style.display = '';
    }
  };

  showPage();

  /* ================================================
     LOAD MORE
     ================================================ */
  loadMoreBtn.addEventListener('click', () => {
    currentPage++;
    showPage();
  });

  /* ================================================
     FILTER CHIPS
     ================================================ */
  document.querySelectorAll('.filter-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      currentFilter = chip.dataset.filter;
      currentPage = 1;
      showPage();
    });
  });

  /* ================================================
     EXPANDING CARD TOGGLE
     ================================================ */
  grid.addEventListener('click', (e) => {
    const toggle = e.target.closest('.j-expand-hint');
    if (!toggle) return;

    const cardId = toggle.dataset.toggle;
    const card = grid.querySelector(`.j-card[data-id="${cardId}"]`);
    if (!card) return;

    if (expandedCardId === cardId) {
      card.classList.remove('expanded');
      expandedCardId = null;
    } else {
      // Close previously expanded
      if (expandedCardId) {
        const prev = grid.querySelector(`.j-card[data-id="${expandedCardId}"]`);
        if (prev) prev.classList.remove('expanded');
      }
      card.classList.add('expanded');
      expandedCardId = cardId;

      // Scroll into view
      setTimeout(() => {
        card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 150);
    }
  });

  /* ================================================
     WISHLIST TOGGLE
     ================================================ */
  grid.addEventListener('click', (e) => {
    const btn = e.target.closest('.j-wish');
    if (!btn) return;
    e.stopPropagation();
    const svg = btn.querySelector('svg');
    const isFilled = svg.getAttribute('fill') !== 'none';
    if (isFilled) {
      svg.setAttribute('fill', 'none');
      svg.style.color = '';
    } else {
      svg.setAttribute('fill', '#DC2626');
      svg.style.color = '#DC2626';
    }
  });

  /* ================================================
     LIGHTBOX
     ================================================ */
  const lightbox = document.createElement('div');
  lightbox.className = 'j-lightbox hidden';
  lightbox.innerHTML = `<button class="j-lightbox-close">&times;</button><img src="" alt="" class="j-lightbox-img">`;
  document.body.appendChild(lightbox);

  const closeLightbox = () => lightbox.classList.add('hidden');
  lightbox.addEventListener('click', closeLightbox);
  lightbox.querySelector('.j-lightbox-close').addEventListener('click', closeLightbox);

  grid.addEventListener('click', (e) => {
    if (e.target.classList.contains('js-zoom-img')) {
      e.stopPropagation();
      lightbox.querySelector('.j-lightbox-img').src = e.target.src;
      lightbox.classList.remove('hidden');
    }
  });

});
