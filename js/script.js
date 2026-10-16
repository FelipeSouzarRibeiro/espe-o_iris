/* ==========================================================================
   ESPAÇO IRIS — COMPORTAMENTOS INTERATIVOS
   Atelier de Beleza & Haute Coiffure • São José dos Campos
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* -------------------------------------------------------------
     1. MENU MOBILE (DRAWER)
     ------------------------------------------------------------- */
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenuCloseBtn = document.getElementById('mobile-menu-close');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileBackdrop = document.getElementById('mobile-menu-backdrop');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  function openMobileMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.remove('translate-x-full');
    if (mobileBackdrop) {
      mobileBackdrop.classList.remove('opacity-0', 'pointer-events-none');
      mobileBackdrop.classList.add('opacity-100', 'pointer-events-auto');
    }
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.add('translate-x-full');
    if (mobileBackdrop) {
      mobileBackdrop.classList.remove('opacity-100', 'pointer-events-auto');
      mobileBackdrop.classList.add('opacity-0', 'pointer-events-none');
    }
    document.body.style.overflow = '';
  }

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', openMobileMenu);
  }
  if (mobileMenuCloseBtn) {
    mobileMenuCloseBtn.addEventListener('click', closeMobileMenu);
  }
  if (mobileBackdrop) {
    mobileBackdrop.addEventListener('click', closeMobileMenu);
  }
  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  /* -------------------------------------------------------------
     2. HERO BACKGROUND CROSSFADE
     ------------------------------------------------------------- */
  const heroSlides = document.querySelectorAll('.hero-bg-slide');
  if (heroSlides.length > 1) {
    let currentSlide = 0;
    setInterval(() => {
      heroSlides[currentSlide].classList.remove('active');
      currentSlide = (currentSlide + 1) % heroSlides.length;
      heroSlides[currentSlide].classList.add('active');
    }, 4500);
  }

  /* -------------------------------------------------------------
     3. INTERACTIVE BEFORE & AFTER SLIDER
     ------------------------------------------------------------- */
  const sliderContainers = document.querySelectorAll('.ba-slider-container');
  sliderContainers.forEach(container => {
    const afterWrapper = container.querySelector('.ba-after-wrapper');
    const handle = container.querySelector('.ba-handle');
    if (!afterWrapper || !handle) return;

    let isDragging = false;

    function updateSlider(clientX) {
      const rect = container.getBoundingClientRect();
      let offsetX = clientX - rect.left;
      if (offsetX < 0) offsetX = 0;
      if (offsetX > rect.width) offsetX = rect.width;
      const percentage = (offsetX / rect.width) * 100;
      afterWrapper.style.width = `${percentage}%`;
      handle.style.left = `${percentage}%`;
    }

    handle.addEventListener('mousedown', (e) => {
      isDragging = true;
      e.preventDefault();
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      updateSlider(e.clientX);
    });

    // Touch support for mobile devices
    handle.addEventListener('touchstart', (e) => {
      isDragging = true;
    }, { passive: true });

    window.addEventListener('touchend', () => {
      isDragging = false;
    });

    window.addEventListener('touchmove', (e) => {
      if (!isDragging || !e.touches[0]) return;
      updateSlider(e.touches[0].clientX);
    }, { passive: true });

    // Click anywhere on container to move slider
    container.addEventListener('click', (e) => {
      updateSlider(e.clientX);
    });
  });

  /* -------------------------------------------------------------
     4. CURADORIA DE RESULTADOS (GALERIA INTERATIVA COM FILTROS)
     ------------------------------------------------------------- */
  const filterButtons = document.querySelectorAll('[data-filter]');
  const galleryItems = document.querySelectorAll('.gallery-card');
  const galleryGrid = document.getElementById('gallery-grid');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      // Update button visual states
      filterButtons.forEach(b => {
        b.classList.remove('bg-primary', 'text-on-primary');
        b.classList.add('text-on-surface-variant', 'hover:text-on-surface');
      });
      btn.classList.add('bg-primary', 'text-on-primary');
      btn.classList.remove('text-on-surface-variant', 'hover:text-on-surface');

      // Toggle centered layout if vitrine is filtered
      if (galleryGrid) {
        if (filter === 'vitrine') {
          galleryGrid.classList.add('is-vitrine-active');
        } else {
          galleryGrid.classList.remove('is-vitrine-active');
        }
      }

      // Filter gallery cards with smooth animation
      galleryItems.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filter === 'all' || category === filter || (filter === 'cortes' && category.includes('cortes'))) {
          item.style.display = '';
          item.classList.add('animate-fade-in');
        } else {
          item.style.display = 'none';
          item.classList.remove('animate-fade-in');
        }
      });
    });
  });

  // Inicializa o filtro com a aba padrão (Vitrine como primeiro)
  const defaultTab = document.querySelector('[data-filter="vitrine"]');
  if (defaultTab) {
    defaultTab.click();
  }

  /* -------------------------------------------------------------
     4.1. VITRINE 3D VR (SEQUÊNCIA EM CANVAS CONTROLADA PELO SCROLL)
     - NÃO se mexe sozinho: fica 100% estático sem rolagem do usuário.
     - Scroll do mouse (Wheel) e Scroll da página avançam/retrocedem os quadros.
     - Deslocamento lateral e rotação sutil 3D ("indo para um lado e para o outro, bem pouco").
     - Suporta clique e arraste para inspeção 360° com o mouse ou toque no celular.
     ------------------------------------------------------------- */
  const vrContainer = document.getElementById('vitrine-vr-container');
  const vrCanvas = document.getElementById('vitrine-vr-canvas');
  const vrPrevBtn = document.getElementById('vitrine-prev-btn');
  const vrNextBtn = document.getElementById('vitrine-next-btn');
  const vrBadge = document.getElementById('vitrine-model-badge');
  const vrTitle = document.getElementById('vitrine-model-title');
  const vrDotsContainer = document.getElementById('vitrine-dots');

  if (vrContainer && vrCanvas) {
    const ctx = vrCanvas.getContext('2d');

    // Catálogo de Modelos 3D (Extensível para quantos vídeos desejar)
    const vitrineModels = [
      {
        id: 'cabelo_1',
        title: 'Mechas & Ondas Douradas',
        badge: 'Modelo 01 de 02',
        basePath: 'img/videos/cabelo_frames/frame_',
        totalFrames: 72,
        ext: '.webp'
      },
      {
        id: 'cabelo_2',
        title: 'Morena Iluminada & Contorno',
        badge: 'Modelo 02 de 02',
        basePath: 'img/videos/cabelo_2_frames/frame_',
        totalFrames: 60,
        ext: '.webp'
      }
    ];

    let activeModelIdx = 0;
    const modelCaches = {}; // Cache de imagens carregadas por modelo

    let targetFrame = 0;
    let currentFrame = 0;
    let lastDrawnFrame = -1;
    let isDragging = false;
    let startX = 0;
    let startFrame = 0;
    let targetShiftX = 0;
    let currentShiftX = 0;
    let targetRotateY = 0;
    let currentRotateY = 0;

    // Função para pré-carregar um modelo específico
    function preloadModel(idx) {
      if (modelCaches[idx]) return modelCaches[idx];
      const model = vitrineModels[idx];
      const frames = [];

      for (let i = 1; i <= model.totalFrames; i++) {
        const img = new Image();
        const numStr = String(i).padStart(3, '0');
        img.src = `${model.basePath}${numStr}${model.ext}`;
        img.onload = () => {
          if (idx === activeModelIdx && i === 1 && lastDrawnFrame === -1) {
            drawCurrentFrame(0);
          }
        };
        frames.push(img);
      }

      modelCaches[idx] = frames;
      return frames;
    }

    // Inicializa o cache para o primeiro modelo
    preloadModel(0);
    // Pré-carrega o segundo modelo em segundo plano para transição instantânea
    if (vitrineModels.length > 1) {
      setTimeout(() => preloadModel(1), 800);
    }

    function drawCurrentFrame(index) {
      const model = vitrineModels[activeModelIdx];
      const frames = modelCaches[activeModelIdx] || preloadModel(activeModelIdx);
      const frameIdx = Math.max(0, Math.min(model.totalFrames - 1, Math.round(index)));
      const img = frames[frameIdx];

      if (img && img.complete && img.naturalWidth > 0) {
        ctx.clearRect(0, 0, vrCanvas.width, vrCanvas.height);
        ctx.drawImage(img, 0, 0, vrCanvas.width, vrCanvas.height);
        lastDrawnFrame = frameIdx;
      }
    }

    // Renderiza os Dots de seleção rápida
    function renderDots() {
      if (!vrDotsContainer) return;
      vrDotsContainer.innerHTML = '';
      vitrineModels.forEach((m, idx) => {
        const dot = document.createElement('button');
        dot.className = `vitrine-dot ${idx === activeModelIdx ? 'is-active' : ''}`;
        dot.setAttribute('aria-label', `Ver ${m.title}`);
        dot.setAttribute('title', `${m.title}`);
        dot.addEventListener('click', (e) => {
          e.stopPropagation();
          switchModel(idx);
        });
        vrDotsContainer.appendChild(dot);
      });
    }

    // Alterna para outro modelo com transição suave
    function switchModel(newIdx) {
      if (newIdx === activeModelIdx) return;
      activeModelIdx = newIdx;
      const model = vitrineModels[activeModelIdx];

      // Efeito de transição sutil
      vrCanvas.style.opacity = '0.35';
      setTimeout(() => {
        targetFrame = 0;
        currentFrame = 0;
        lastDrawnFrame = -1;
        targetShiftX = 0;
        currentShiftX = 0;
        targetRotateY = 0;
        currentRotateY = 0;

        if (vrBadge) vrBadge.textContent = model.badge;
        if (vrTitle) vrTitle.textContent = model.title;

        // Atualiza estado ativo dos dots
        if (vrDotsContainer) {
          const dots = vrDotsContainer.querySelectorAll('.vitrine-dot');
          dots.forEach((d, i) => d.classList.toggle('is-active', i === activeModelIdx));
        }

        drawCurrentFrame(0);
        vrCanvas.style.opacity = '1';
      }, 150);
    }

    // Eventos das Setas de Navegação
    if (vrPrevBtn) {
      vrPrevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const prevIdx = (activeModelIdx - 1 + vitrineModels.length) % vitrineModels.length;
        switchModel(prevIdx);
      });
    }

    if (vrNextBtn) {
      vrNextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const nextIdx = (activeModelIdx + 1) % vitrineModels.length;
        switchModel(nextIdx);
      });
    }

    renderDots();

    // 1. Scroll da Página (quando o usuário rola a tela normalmente):
    function onPageScroll() {
      const rect = vrContainer.getBoundingClientRect();
      const vh = window.innerHeight;

      if (rect.bottom > 0 && rect.top < vh) {
        const progress = Math.max(0, Math.min(1, (vh - rect.top) / (vh + rect.height)));
        const model = vitrineModels[activeModelIdx];
        
        targetFrame = progress * (model.totalFrames - 1);

        const normProgress = (progress - 0.5) * 2;
        targetShiftX = -normProgress * 16;
        targetRotateY = normProgress * 4.0;
      }
    }
    window.addEventListener('scroll', onPageScroll, { passive: true });
    onPageScroll();

    // 2. Scroll da Roda do Mouse (Wheel) diretamente sobre o elemento:
    vrContainer.addEventListener('wheel', (e) => {
      const model = vitrineModels[activeModelIdx];
      const delta = Math.sign(e.deltaY || e.deltaX);
      targetFrame += delta * 2.5;
      targetFrame = Math.max(0, Math.min(model.totalFrames - 1, targetFrame));

      const norm = (targetFrame / (model.totalFrames - 1) - 0.5) * 2;
      targetShiftX = -norm * 16;
      targetRotateY = norm * 4.0;

      if (Math.abs(e.deltaY) > 0) {
        e.preventDefault();
      }
    }, { passive: false });

    // 3. Arraste com o Mouse (Click and Drag 3D)
    vrContainer.addEventListener('mousedown', (e) => {
      // Evita disparar se clicou nas setas ou nos dots
      if (e.target.closest('.vitrine-nav-btn') || e.target.closest('.vitrine-dot')) return;
      isDragging = true;
      startX = e.clientX;
      startFrame = targetFrame;
      vrContainer.style.cursor = 'grabbing';
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const model = vitrineModels[activeModelIdx];
      const dx = e.clientX - startX;
      const frameDelta = (dx / 320) * (model.totalFrames - 1);
      targetFrame = Math.max(0, Math.min(model.totalFrames - 1, startFrame - frameDelta));

      const norm = (targetFrame / (model.totalFrames - 1) - 0.5) * 2;
      targetShiftX = -norm * 16;
      targetRotateY = norm * 4.0;
    });

    window.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        vrContainer.style.cursor = 'grab';
      }
    });

    // 4. Suporte a Toque em Dispositivos Móveis (Swipe)
    let touchStartX = 0;
    let touchStartFrame = 0;
    vrContainer.addEventListener('touchstart', (e) => {
      if (e.target.closest('.vitrine-nav-btn') || e.target.closest('.vitrine-dot')) return;
      if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartFrame = targetFrame;
      }
    }, { passive: true });

    vrContainer.addEventListener('touchmove', (e) => {
      if (e.touches.length === 1 && touchStartX !== 0) {
        const model = vitrineModels[activeModelIdx];
        const dx = e.touches[0].clientX - touchStartX;
        const frameDelta = (dx / 260) * (model.totalFrames - 1);
        targetFrame = Math.max(0, Math.min(model.totalFrames - 1, touchStartFrame - frameDelta));

        const norm = (targetFrame / (model.totalFrames - 1) - 0.5) * 2;
        targetShiftX = -norm * 16;
        targetRotateY = norm * 4.0;
      }
    }, { passive: true });

    // 5. Loop Reativo (Lerp suave de interpolação)
    // NUNCA avança sozinho quando o usuário para de interagir
    function renderLoop() {
      const frameDiff = Math.abs(targetFrame - currentFrame);
      const shiftDiff = Math.abs(targetShiftX - currentShiftX);

      if (frameDiff > 0.02 || shiftDiff > 0.05) {
        currentFrame += (targetFrame - currentFrame) * 0.18;
        currentShiftX += (targetShiftX - currentShiftX) * 0.15;
        currentRotateY += (targetRotateY - currentRotateY) * 0.15;

        const rounded = Math.round(currentFrame);
        if (rounded !== lastDrawnFrame) {
          drawCurrentFrame(rounded);
        }

        vrCanvas.style.transform = `perspective(1000px) translate3d(${currentShiftX.toFixed(2)}px, 0, 0) rotateY(${currentRotateY.toFixed(2)}deg)`;
      }

      requestAnimationFrame(renderLoop);
    }
    requestAnimationFrame(renderLoop);
  }

  /* -------------------------------------------------------------
     5. LIGHTBOX MODAL PARA FOTOS E AVALIAÇÕES
     ------------------------------------------------------------- */
  const lightbox = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');

  function openLightbox(src, caption) {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = src;
    if (lightboxCaption) {
      lightboxCaption.textContent = caption || '';
    }
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('[data-lightbox-src]').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const src = trigger.getAttribute('data-lightbox-src');
      const caption = trigger.getAttribute('data-lightbox-caption');
      openLightbox(src, caption);
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeLightbox();
      closeMobileMenu();
    }
  });

  /* -------------------------------------------------------------
     6. REVIEWS / AVALIAÇÕES - SELEÇÃO INTERATIVA
     ------------------------------------------------------------- */
  const reviewCards = document.querySelectorAll('.client-review-card');
  const reviewModalTrigger = document.querySelectorAll('.review-preview-trigger');

  reviewCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.classList.add('border-secondary/40');
    });
    card.addEventListener('mouseleave', () => {
      card.classList.remove('border-secondary/40');
    });
  });

  /* -------------------------------------------------------------
     7. SCROLLSPY / ATIVAÇÃO DE LINKS NO MENU SUPERIOR
     ------------------------------------------------------------- */
  const navLinks = document.querySelectorAll('nav a[data-section]');
  const sections = document.querySelectorAll('section[id]');

  function updateActiveNavLink() {
    let scrollPos = window.scrollY + 120;
    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('text-primary', 'font-semibold', 'border-b', 'border-primary');
            link.classList.remove('text-on-surface-variant');
          } else {
            link.classList.remove('text-primary', 'font-semibold', 'border-b', 'border-primary');
            link.classList.add('text-on-surface-variant');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });

  /* -------------------------------------------------------------
     8. DROPDOWN DE SUBPÁGINAS (MENU "MAIS")
     ------------------------------------------------------------- */
  const dropdownWrapper = document.getElementById('nav-dropdown-wrapper');
  const dropdownBtn = document.getElementById('nav-dropdown-btn');
  const dropdownItems = document.querySelectorAll('.dropdown-item');

  if (dropdownWrapper && dropdownBtn) {
    dropdownBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = dropdownWrapper.classList.toggle('open');
      dropdownBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    dropdownItems.forEach(item => {
      item.addEventListener('click', () => {
        dropdownWrapper.classList.remove('open');
        dropdownBtn.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('click', (e) => {
      if (!dropdownWrapper.contains(e.target)) {
        dropdownWrapper.classList.remove('open');
        dropdownBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* -------------------------------------------------------------
     9. ANIMAÇÃO DE DISSOLUÇÃO DE TEXTOS AO ROLAR (SCROLL REVEAL)
     ------------------------------------------------------------- */
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if ('IntersectionObserver' in window && revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('is-revealed'));
  }
});

