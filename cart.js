/**
 * La Galería Personal (Cart Side Drawer)
 * Handles cart state, opening/closing the drawer, and AI Sommelier recommendation.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. DOM Elements
    const body = document.body;
    const cartOverlay = document.getElementById('cartOverlay');
    const cartDrawer = document.getElementById('cartDrawer');
    const cartCloseBtn = document.getElementById('cartClose');
    const cartItemsList = document.getElementById('cartItems');
    const cartIA = document.getElementById('cartIA');

    // 2. Cart State
    let cart = []; // Array of product objects
    try {
        const storedCart = localStorage.getItem('artesania_cart');
        if (storedCart) {
            cart = JSON.parse(storedCart);
        }
    } catch (e) {
        console.error('Could not load cart from local storage', e);
    }

    const saveCart = () => {
        localStorage.setItem('artesania_cart', JSON.stringify(cart));
    };

    // 3. Drawer Toggle Logic
    const openCart = () => {
        cartOverlay.classList.add('active');
        cartDrawer.classList.add('active');
        body.classList.add('cart-open');
    };

    const closeCart = () => {
        cartOverlay.classList.remove('active');
        cartDrawer.classList.remove('active');
        body.classList.remove('cart-open');
    };

    if (cartCloseBtn) cartCloseBtn.addEventListener('click', closeCart);
    if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

    const cartToggleBtn = document.getElementById('cartToggleBtn');
    if (cartToggleBtn) {
        cartToggleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openCart();
        });
    }

    const attachAddListeners = () => {
        // Use event delegation to properly handle dynamically generated elements (like catalog.html)
        document.body.addEventListener('click', (e) => {
            // Find the closest add to cart button
            const btn = e.target.closest('.btn-add-cart, .j-cart, .btn-marble');
            if (!btn) return;

            // If it's a marble button, ensure it's the "Añadir al Carrito" one
            if (btn.classList.contains('btn-marble') && !btn.textContent.includes('Añadir')) return;

            e.preventDefault();
            e.stopPropagation();

            // Glow animation
            btn.classList.add('btn-glow-gold');
            setTimeout(() => btn.classList.remove('btn-glow-gold'), 400);

            // Determine Product ID
            let productId = 1; // Default

            const card = btn.closest('.product-card, .j-card');
            if (card) {
                if (card.dataset.id) {
                    productId = parseInt(card.dataset.id);
                } else if (card.id && card.id.includes('-')) {
                    productId = parseInt(card.id.split('-')[1]);
                }
            } else {
                // For product.html, try URL
                const urlParams = new URLSearchParams(window.location.search);
                if (urlParams.has('id')) {
                    productId = parseInt(urlParams.get('id'));
                }
            }

            // Find product data
            const product = window.appProducts ? window.appProducts.find(p => p.id === productId) : null;

            if (product) {
                addToCart(product);
            } else {
                addToCart({
                    id: 999,
                    cat: 'ceramica',
                    title: 'Pieza Artesanal',
                    price: 99,
                    img: 'assets/images/product-vase.png'
                });
            }

            // Open the cart after a tiny delay
            setTimeout(openCart, 300);
        });
    };

    // 4. Cart Logic
    const addToCart = (product) => {
        // Append to state
        cart.push(product);
        saveCart();
        renderCart();
        updateIA();
    };

    const renderCart = () => {
        const checkoutBtn = document.querySelector('.btn-checkout');

        if (!cartItemsList) return;

        if (cart.length === 0) {
            cartItemsList.innerHTML = '<li style="color:var(--color-text-light);text-align:center;padding:1rem;">Tu colección está vacía.</li>';
            if (checkoutBtn) checkoutBtn.innerHTML = 'Finalizar Selección';
            return;
        }

        // Render items
        cartItemsList.innerHTML = cart.map((p, index) => `
          <li class="cart-item">
              <img src="${p.img}" alt="${p.title}" class="cart-item-img">
              <div class="cart-item-info">
                  <h4 class="cart-item-title">${p.title}</h4>
                  <div class="cart-item-price">€${p.price}</div>
              </div>
          </li>
      `).join('');

        // Calculate Total
        const total = cart.reduce((sum, item) => sum + (item.price || 0), 0);
        if (checkoutBtn) {
            checkoutBtn.innerHTML = `Finalizar Selección • €${total} <span class="currency">EUR</span>`;
        }
    };

    // 5. Artificial Intelligence Recommendation Logic
    const updateIA = () => {
        if (!cartIA) return;

        if (cart.length === 0) {
            cartIA.innerHTML = '<span class="ia-placeholder">Sommelier IA analiza tu colección...</span>';
            return;
        }

        let recommendation = "";
        if (cart.length === 1) {
            recommendation = `Excelente elección. Esta pieza única aportará carácter e historia a tu espacio.`;
        } else {
            // Check categories 
            const cats = new Set(cart.map(p => p.cat));
            if (cats.has('ceramica') && cats.has('cuero')) {
                recommendation = `Has elegido una combinación perfecta. La cerámica y la piel crearán en tu hogar una atmósfera que une la frescura con la cálida historia andaluza.`;
            } else if (cats.has('ceramica') && cats.has('madera')) {
                recommendation = `Materiales nobles. El contraste entre la tierra cocida y la calidez natural de la madera aportará un equilibrio extraordinario a tu interiorismo.`;
            } else {
                recommendation = `Una selección muy armónica. El Sommelier IA percibe un excelente gusto por el detalle y las texturas puras.`;
            }
        }

        cartIA.innerHTML = recommendation;
    };

    // Setup
    attachAddListeners();
    renderCart();
    updateIA();
});
