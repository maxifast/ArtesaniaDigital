/* ============================================================
   ARTESANÍA DIGITAL — Interactive Script
   UI/UX Pro Max: Intersection Observer, smooth interactions
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide icons (if available)
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  /* ----------------------------------------
     1. NAVBAR — Scroll background change
     ---------------------------------------- */
  const navbar = document.getElementById('navbar');
  const scrollThreshold = 50;

  const handleNavbarScroll = () => {
    if (window.scrollY > scrollThreshold) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll(); // Initial check

  /* ----------------------------------------
     2. MOBILE MENU TOGGLE
     ---------------------------------------- */
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      const spans = menuToggle.querySelectorAll('span');
      if (navLinks.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      }
    });

    // Close menu on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const spans = menuToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      });
    });
  }

  /* ----------------------------------------
     3. SMOOTH SCROLL for anchor links
     ---------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      e.preventDefault();
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        const offset = 100; // navbar height + spacing
        const top = targetEl.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ----------------------------------------
     4. SCROLL REVEAL — Intersection Observer
     (UUPM: Use Intersection Observer API)
     ---------------------------------------- */
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback: show everything
    revealElements.forEach(el => el.classList.add('visible'));
  }

  /* ----------------------------------------
     5. AI SOMMELIER — Chat Demo Interaction
     ---------------------------------------- */
  const chatInput = document.getElementById('chatInput');
  const chatSend = document.getElementById('chatSend');
  const chatMessages = document.getElementById('chatMessages');

  // Predefined AI responses for demo
  const aiResponses = {
    default: 'He explorado nuestra colección y encontré algo especial para ti. Déjame analizar las opciones según tus preferencias de estilo, color y región...',
    'cerámica azul mediterránea': '¡Excelente elección! Tenemos 5 piezas en azul cobalto de talleres andaluces. Destacan las obras de María Ruiz de Granada, cuyas técnicas se remontan al siglo XVI morisco.',
    'textil artesanal para decoración': 'Para textil artesanal recomiendo las mantas de lana merina de Ezcaray (La Rioja) y los tapices de esparto de Murcia. Ambos combinan perfectamente con interiores modernos.',
    'regalo especial hecho a mano': 'Para un regalo memorable, te sugiero el cuenco de terracota de José Pérez. Cada pieza es única y viene con un certificado de autenticidad firmado por el artesano.',
    'piezas de lujo para interiorismo': 'Para proyectos de interiorismo tenemos piezas exclusivas: jarrones de gran formato de Biar (Alicante) y esculturas cerámicas de Sargadelos (Galicia). ¿Necesitas factura profesional?',
    'cerámica tradicional de granada': 'Granada es cuna de la cerámica nazarí. Te recomiendo el taller de la familia Ruiz, 4ª generación creando piezas con esmaltes de cobre y cobalto usando técnicas de la Alhambra.'
  };

  const addMessage = (text, isAi) => {
    const msgDiv = document.createElement('div');
    msgDiv.className = 'chat-message';
    msgDiv.style.animationDelay = '0s';
    msgDiv.innerHTML = `
      <div class="chat-avatar ${isAi ? 'ai' : 'user'}">${isAi ? 'IA' : 'TÚ'}</div>
      <div class="chat-bubble ${isAi ? 'ai-response' : ''}">${text}</div>
    `;
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  };

  const handleSend = () => {
    const text = chatInput.value.trim();
    if (!text) return;

    // Add user message
    addMessage(text, false);
    chatInput.value = '';

    // Find best matching response
    const lowerText = text.toLowerCase();
    let response = aiResponses.default;
    for (const [key, val] of Object.entries(aiResponses)) {
      if (key !== 'default' && lowerText.includes(key.split(' ')[0])) {
        response = val;
        break;
      }
    }

    // Simulate AI "thinking" delay
    setTimeout(() => {
      addMessage(response, true);
    }, 800);
  };

  if (chatSend) {
    chatSend.addEventListener('click', handleSend);
  }

  if (chatInput) {
    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSend();
      }
    });
  }

  // Suggestion chips
  document.querySelectorAll('.suggestion-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const query = chip.dataset.query;
      if (query && chatInput) {
        chatInput.value = query;
        handleSend();
      }
    });
  });

  /* ----------------------------------------
     6. PRODUCT WISHLIST — Heart toggle
     ---------------------------------------- */
  document.querySelectorAll('.product-wishlist').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const svg = btn.querySelector('svg');
      const isFilled = svg.getAttribute('fill') !== 'none';

      if (isFilled) {
        svg.setAttribute('fill', 'none');
        svg.setAttribute('stroke', 'currentColor');
      } else {
        svg.setAttribute('fill', '#DC2626');
        svg.setAttribute('stroke', '#DC2626');
      }
    });
  });

  /* ----------------------------------------
     7. TYPING EFFECT for Sommelier Placeholder
     ---------------------------------------- */
  const placeholders = [
    'Busco un regalo especial para mi madre...',
    'Cerámica azul para mi cocina mediterránea...',
    'Algo único de Andalucía para decorar...',
    'Piezas artesanales para un restaurante...',
    'Textil hecho a mano para mi salón...'
  ];

  let placeholderIndex = 0;

  if (chatInput) {
    setInterval(() => {
      if (document.activeElement !== chatInput && chatInput.value === '') {
        placeholderIndex = (placeholderIndex + 1) % placeholders.length;
        chatInput.setAttribute('placeholder', placeholders[placeholderIndex]);
      }
    }, 4000);
  }
});
