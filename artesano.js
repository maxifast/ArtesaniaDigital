/**
 * El Taller Digital - Artesano Dashboard Logic
 * Handles SPA routing, product CRUD with localStorage, and mock AI.
 */

const app = {
    currentView: 'view-login',
    isRecording: false,
    recordTimer: null,
    recordSeconds: 0,
    myProducts: [],
    selectedImages: [],

    // --- Init ---
    init: function () {
        // Load saved products
        try {
            const saved = localStorage.getItem('artesano_products');
            if (saved) this.myProducts = JSON.parse(saved);
        } catch (e) { console.error(e); }

        // Close modals on backdrop click
        document.querySelectorAll('.a-modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) app.closeModals();
            });
        });

        // File input listener
        const fileInput = document.getElementById('productImages');
        if (fileInput) {
            fileInput.addEventListener('change', (e) => {
                this.handleImageUpload(e.target.files);
            });
        }
    },

    saveProducts: function () {
        localStorage.setItem('artesano_products', JSON.stringify(this.myProducts));
    },

    // --- Routing ---
    showView: function (viewId, tabId = null) {
        document.querySelectorAll('.a-view').forEach(v => v.classList.remove('active'));
        const target = document.getElementById(`view-${viewId}`);
        if (target) {
            target.classList.add('active');
            this.currentView = `view-${viewId}`;
            const fab = document.getElementById('mainFab');
            if (viewId === 'dashboard') {
                if (tabId) this.switchTab(tabId);
                if (tabId === 'tab-obras' && fab) fab.classList.add('visible');
                this.renderMyProducts();
            } else {
                if (fab) fab.classList.remove('visible');
            }
        }
    },

    showOnboarding: function () { this.showView('onboarding'); },
    showDashboard: function (tabId = 'tab-resumen') {
        this.showView('dashboard', tabId);
        // Simulated registration if first time
        if (window.MaestrosData && !window.MaestrosData.getById('maria-ruiz')) {
            // In a real app we'd get this from the login session
        }
    },

    // --- Tabs ---
    switchTab: function (tabId, navElement = null) {
        document.querySelectorAll('.a-tab-pane').forEach(p => p.classList.remove('active'));
        const target = document.getElementById(tabId);
        if (target) target.classList.add('active');

        if (navElement) {
            document.querySelectorAll('.a-nav-item').forEach(n => n.classList.remove('active'));
            navElement.classList.add('active');
        } else {
            document.querySelectorAll('.a-nav-item').forEach(n => {
                n.classList.remove('active');
                if (n.getAttribute('onclick') && n.getAttribute('onclick').includes(tabId)) {
                    n.classList.add('active');
                }
            });
        }

        const fab = document.getElementById('mainFab');
        if (fab) {
            if (tabId === 'tab-obras') { fab.classList.add('visible'); this.renderMyProducts(); }
            else fab.classList.remove('visible');
        }
    },

    // --- Modals ---
    openModal: function (modalId) {
        const modal = document.getElementById(`modal-${modalId}`);
        if (modal) modal.classList.add('active');
    },
    closeModals: function () {
        document.querySelectorAll('.a-modal').forEach(m => m.classList.remove('active'));
        this.stopMic();
    },
    showApprovalModal: function () { this.openModal('approve'); },

    // --- Image Upload ---
    handleImageUpload: function (files) {
        this.selectedImages = [];
        const preview = document.getElementById('imagePreview');
        if (!preview) return;
        preview.innerHTML = '';

        const maxFiles = Math.min(files.length, 3);
        for (let i = 0; i < maxFiles; i++) {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.selectedImages.push(e.target.result);
                const img = document.createElement('img');
                img.src = e.target.result;
                img.style.cssText = 'width:60px;height:60px;object-fit:cover;border-radius:8px;';
                preview.appendChild(img);
            };
            reader.readAsDataURL(files[i]);
        }
    },

    // --- Product Creation ---
    startCreateFlow: function () {
        this.selectedImages = [];
        const preview = document.getElementById('imagePreview');
        if (preview) preview.innerHTML = '';
        const fileInput = document.getElementById('productImages');
        if (fileInput) fileInput.value = '';
        this.openModal('create');
    },

    toggleMic: function () {
        const btn = document.getElementById('btnMic');
        const status = document.getElementById('micStatus');
        if (!this.isRecording) {
            this.isRecording = true;
            btn.classList.add('recording');
            status.classList.add('recording');
            this.recordSeconds = 0;
            this.recordTimer = setInterval(() => {
                this.recordSeconds++;
                status.innerText = `Grabando... 00:${this.recordSeconds.toString().padStart(2, '0')}`;
                if (this.recordSeconds >= 60) this.stopMic();
            }, 1000);
            status.innerText = "Grabando... 00:00";
        } else {
            this.stopMic();
            status.innerText = "Audio capturado ✓. Toca para re-grabar.";
            status.classList.remove('recording');
        }
    },

    stopMic: function () {
        this.isRecording = false;
        clearInterval(this.recordTimer);
        const btn = document.getElementById('btnMic');
        if (btn) btn.classList.remove('recording');
    },

    simulateAiGeneration: function () {
        const btn = document.querySelector('#modal-create .a-btn-primary');
        const originalText = btn.innerText;
        btn.innerText = "Sommelier IA escribiendo...";
        btn.disabled = true;

        setTimeout(() => {
            btn.innerText = originalText;
            btn.disabled = false;
            this.closeModals();
            // Pre-fill approval modal with AI-generated text
            const titleInput = document.getElementById('approveTitle');
            const descInput = document.getElementById('approveDesc');
            const priceInput = document.getElementById('approvePrice');
            if (titleInput) titleInput.value = "Pieza Artesanal Edición " + (this.myProducts.length + 1);
            if (descInput) descInput.value = "Esta pieza nace de la inspiración de los atardeceres andaluces. Usando técnica nazarí del siglo XIV, el esmalte refleja la luz como el mar Mediterráneo...";
            if (priceInput) priceInput.value = Math.floor(Math.random() * 150 + 50);
            this.openModal('approve');
        }, 2000);
    },

    publishProduct: function () {
        const titleInput = document.getElementById('approveTitle');
        const descInput = document.getElementById('approveDesc');
        const priceInput = document.getElementById('approvePrice');

        const newProduct = {
            id: Date.now(),
            title: titleInput ? titleInput.value : 'Obra sin título',
            description: descInput ? descInput.value : '',
            price: priceInput ? parseFloat(priceInput.value) || 0 : 0,
            img: this.selectedImages.length > 0 ? this.selectedImages[0] : 'assets/images/product-vase.png',
            status: 'active',
            createdAt: new Date().toLocaleDateString('es-ES')
        };

        this.myProducts.push(newProduct);
        this.saveProducts();
        this.closeModals();
        this.switchTab('tab-obras');
        this.renderMyProducts();

        // Show success feedback
        const fab = document.getElementById('mainFab');
        if (fab) {
            fab.style.background = '#10B981';
            fab.innerHTML = '✓';
            setTimeout(() => {
                fab.style.background = '';
                fab.innerHTML = '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>';
            }, 1500);
        }
    },

    deleteProduct: function (id) {
        this.myProducts = this.myProducts.filter(p => p.id !== id);
        this.saveProducts();
        this.renderMyProducts();
    },

    renderMyProducts: function () {
        const list = document.getElementById('dynamicProductsList');
        if (!list) return;

        if (this.myProducts.length === 0) {
            list.innerHTML = '<div style="text-align:center; color:var(--c-text-light); padding:2rem;">Aún no tienes obras publicadas. ¡Pulsa el botón <strong>+</strong> para crear la primera!</div>';
            return;
        }

        list.innerHTML = this.myProducts.map(p => `
            <div class="a-prod-card">
                <img src="${p.img}" class="a-prod-img" alt="${p.title}" onerror="this.src='assets/images/product-vase.png'">
                <div class="a-prod-info">
                    <div class="a-prod-title">${p.title}</div>
                    <div class="a-prod-meta">€${p.price} • ${p.status === 'active' ? '✅ Activa' : '📝 Borrador'}</div>
                </div>
                <button class="a-btn-small" style="color:var(--c-error); border-color:var(--c-error);" onclick="app.deleteProduct(${p.id})">✕</button>
            </div>
        `).join('');

        // Update count chip
        const chip = document.querySelector('#tab-obras .a-filter-chip');
        if (chip) chip.textContent = `Activas (${this.myProducts.length})`;
    },

    openChat: function () { this.openModal('chat'); }
};

document.addEventListener('DOMContentLoaded', () => app.init());
