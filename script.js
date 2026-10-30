/**
 * ====================================================================
 * PORTFÓLIO PREMIUM - PABLO HENRICK ROCHA DA SILVA
 * Arquivo: script.js
 * Descrição: Interatividade fluida, GSAP ScrollTrigger, Cursor & UI
 * ====================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // Inicialização de Ícones Lucide
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // Módulos do Sistema
  initThemeManager();
  initCustomCursor();
  initHeaderAndProgress();
  initMobileNavigation();
  init3DCardTilt();
  initMagneticButtons();
  initGsapAnimations();
  initLiveClocks();
  initGalleryAndLightbox();
  initContactFormAndCopy();
});

/* ====================================================================
   1. GERENCIADOR DE TEMA (CLARO / ESCURO)
   ==================================================================== */
function initThemeManager() {
  const themeToggle = document.getElementById('themeToggle');
  const htmlEl = document.documentElement;
  const bodyEl = document.body;

  // Recupera tema salvo ou prefere escuro por padrão
  const savedTheme = localStorage.getItem('ph_theme') || 'dark';
  applyTheme(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = htmlEl.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      localStorage.setItem('ph_theme', newTheme);

      // Atualiza ícones Lucide após troca
      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }
    });
  }

  function applyTheme(theme) {
    htmlEl.setAttribute('data-theme', theme);
    if (theme === 'light') {
      bodyEl.classList.remove('theme-dark');
      bodyEl.classList.add('theme-light');
      if (window.luxuryThreeInstance) {
        window.luxuryThreeInstance.setTheme(false);
      }
    } else {
      bodyEl.classList.remove('theme-light');
      bodyEl.classList.add('theme-dark');
      if (window.luxuryThreeInstance) {
        window.luxuryThreeInstance.setTheme(true);
      }
    }
  }
}

/* ====================================================================
   2. CURSOR PERSONALIZADO DE ALTA PRECISÃO
   ==================================================================== */
function initCustomCursor() {
  const cursor = document.getElementById('customCursor');
  if (!cursor || window.innerWidth < 992) return;

  const dot = cursor.querySelector('.cursor-dot');
  const ring = cursor.querySelector('.cursor-ring');

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (dot) {
      dot.style.left = `${mouseX}px`;
      dot.style.top = `${mouseY}px`;
    }
  });

  // Interpolação suave do anel externo
  function renderCursor() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;

    if (ring) {
      ring.style.left = `${ringX}px`;
      ring.style.top = `${ringY}px`;
    }

    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);

  // Efeito de expansão ao passar sobre elementos interativos
  const interactiveElements = document.querySelectorAll(
    'a, button, input, select, textarea, .card-3d-tilt, .gallery-item-card, .filter-btn'
  );

  interactiveElements.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('cursor-hover');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('cursor-hover');
    });
  });

  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
  });
}

/* ====================================================================
   3. CABEÇALHO, SCROLL PROGRESS & NAVEGAÇÃO ATIVA
   ==================================================================== */
function initHeaderAndProgress() {
  const header = document.getElementById('siteHeader');
  const progressBar = document.getElementById('scrollProgress');
  const navLinks = document.querySelectorAll('.desktop-nav .nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;

    // Atualiza barra de progresso
    if (progressBar && docHeight > 0) {
      const progressPercent = (scrollY / docHeight) * 100;
      progressBar.style.width = `${progressPercent}%`;
    }

    // Estilo condensado do cabeçalho
    if (header) {
      if (scrollY > 60) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    // Atualiza link de navegação ativo
    let currentSectionId = '';
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 140;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });
}

/* ====================================================================
   4. MENU MOBILE FULLSCREEN (OVERLAY)
   ==================================================================== */
function initMobileNavigation() {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileCloseBtn = document.getElementById('mobileCloseBtn');
  const mobileNavOverlay = document.getElementById('mobileNavOverlay');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (!mobileMenuBtn || !mobileNavOverlay) return;

  function openMenu() {
    mobileNavOverlay.classList.add('open');
    mobileMenuBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';

    // Animação de entrada dos links com GSAP
    if (typeof gsap !== 'undefined') {
      gsap.fromTo(
        mobileLinks,
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, stagger: 0.06, duration: 0.4, ease: 'power2.out' }
      );
    }
  }

  function closeMenu() {
    mobileNavOverlay.classList.remove('open');
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  mobileMenuBtn.addEventListener('click', openMenu);
  if (mobileCloseBtn) {
    mobileCloseBtn.addEventListener('click', closeMenu);
  }

  mobileLinks.forEach((link) => {
    link.addEventListener('click', closeMenu);
  });
}

/* ====================================================================
   5. EFEITO 3D TILT NOS CARDS
   ==================================================================== */
function init3DCardTilt() {
  if (window.innerWidth < 768) return;

  const tiltCards = document.querySelectorAll('.card-3d-tilt');

  tiltCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Limita inclinação suave a no máximo 9 graus
      const rotateX = ((y - centerY) / centerY) * -7;
      const rotateY = ((x - centerX) / centerX) * 7;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      card.style.transition = 'transform 0.5s ease-out';
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'none';
    });
  });
}

/* ====================================================================
   6. BOTÕES MAGNÉTICOS COM REAÇÃO ELÁSTICA
   ==================================================================== */
function initMagneticButtons() {
  if (window.innerWidth < 992) return;

  const magneticBtns = document.querySelectorAll('.magnetic-btn');

  magneticBtns.forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);

      // Puxão magnético suave
      if (typeof gsap !== 'undefined') {
        gsap.to(btn, {
          x: x * 0.28,
          y: y * 0.28,
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    });

    btn.addEventListener('mouseleave', () => {
      if (typeof gsap !== 'undefined') {
        gsap.to(btn, {
          x: 0,
          y: 0,
          duration: 0.6,
          ease: 'elastic.out(1, 0.4)'
        });
      }
    });

    // Reação no Three.js para o botão de exploração
    if (btn.id === 'exploreBtn') {
      btn.addEventListener('mouseenter', () => {
        if (window.luxuryThreeInstance) {
          window.luxuryThreeInstance.burstReaction();
        }
      });
    }
  });
}

/* ====================================================================
   7. ANIMAÇÕES CINEMATOGRÁFICAS COM GSAP & SCROLLTRIGGER
   ==================================================================== */
function initGsapAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  // Animação de Entrada do Hero
  const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  heroTl
    .from('.hero-eyebrow-container', { opacity: 0, y: -20, duration: 0.8, delay: 0.2 })
    .from('.hero-row-first', { opacity: 0, y: 50, duration: 1.1 }, '-=0.5')
    .from('.hero-row-second', { opacity: 0, y: 50, duration: 1.1 }, '-=0.8')
    .from('.hero-manifesto-container', { opacity: 0, y: 30, duration: 0.9 }, '-=0.7')
    .from('.hero-actions-container', { opacity: 0, y: 25, duration: 0.8 }, '-=0.6')
    .from('.hero-meta-bar', { opacity: 0, duration: 1 }, '-=0.4');

  // Animação dos elementos marcados com data-gsap
  const fadeUpElements = document.querySelectorAll('[data-gsap="fade-up"]');
  fadeUpElements.forEach((el) => {
    const delay = parseFloat(el.getAttribute('data-delay')) || 0;
    gsap.from(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        toggleActions: 'play none none none'
      },
      opacity: 0,
      y: 40,
      duration: 0.9,
      delay: delay,
      ease: 'power2.out'
    });
  });

  const fadeRightElements = document.querySelectorAll('[data-gsap="fade-right"]');
  fadeRightElements.forEach((el) => {
    gsap.from(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 85%'
      },
      opacity: 0,
      x: -50,
      duration: 1,
      ease: 'power2.out'
    });
  });

  const fadeLeftElements = document.querySelectorAll('[data-gsap="fade-left"]');
  fadeLeftElements.forEach((el) => {
    gsap.from(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 85%'
      },
      opacity: 0,
      x: 50,
      duration: 1,
      ease: 'power2.out'
    });
  });

  // Contadores Numéricos Animados
  const metricCounters = document.querySelectorAll('[data-counter]');
  metricCounters.forEach((counter) => {
    const targetValue = parseInt(counter.getAttribute('data-counter'), 10) || 0;
    const suffix = counter.getAttribute('data-suffix') || '';

    ScrollTrigger.create({
      trigger: counter,
      start: 'top 90%',
      once: true,
      onEnter: () => {
        const obj = { val: 0 };
        gsap.to(obj, {
          val: targetValue,
          duration: 1.8,
          ease: 'power2.out',
          onUpdate: () => {
            counter.innerText = Math.floor(obj.val) + suffix;
          }
        });
      }
    });
  });
}

/* ====================================================================
   8. HORÁRIO EM TEMPO REAL (BRASÍLIA / SÃO PAULO)
   ==================================================================== */
function initLiveClocks() {
  const clockHero = document.getElementById('localClockHero');
  const clockMobile = document.getElementById('localClockMobile');
  const clockContact = document.getElementById('localClockContact');

  function updateTime() {
    const now = new Date();
    // Horário de Brasília (GMT-3)
    const options = {
      timeZone: 'America/Sao_Paulo',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    };
    const timeString = new Intl.DateTimeFormat('pt-BR', options).format(now);

    if (clockHero) clockHero.textContent = `${timeString} BRT`;
    if (clockMobile) clockMobile.textContent = `${timeString} BRT`;
    if (clockContact) clockContact.textContent = `Horário Local: ${timeString} (GMT-3)`;
  }

  updateTime();
  setInterval(updateTime, 1000);
}

/* ====================================================================
   9. GALERIA & LIGHTBOX INTERATIVO
   ==================================================================== */
function initGalleryAndLightbox() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item-card');

  // Filtros de Categoria
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      galleryItems.forEach((item) => {
        const category = item.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          item.style.display = 'block';
          if (typeof gsap !== 'undefined') {
            gsap.fromTo(item, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.4 });
          }
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // Lightbox Modal
  const lightbox = document.getElementById('galleryLightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxSubtitle = document.getElementById('lightboxSubtitle');
  const closeBtn = document.getElementById('lightboxCloseBtn');
  const backdrop = document.getElementById('lightboxBackdrop');

  if (!lightbox) return;

  galleryItems.forEach((card) => {
    card.addEventListener('click', () => {
      const img = card.querySelector('.gallery-img');
      const title = card.querySelector('.overlay-title')?.textContent || 'Registro';
      const loc = card.querySelector('.overlay-location')?.textContent || '';
      const tag = card.querySelector('.overlay-tag')?.textContent || '';

      if (img && lightboxImg) {
        lightboxImg.src = img.src;
        lightboxImg.alt = title;
      }
      if (lightboxTitle) lightboxTitle.textContent = title;
      if (lightboxSubtitle) lightboxSubtitle.textContent = `${tag} // ${loc}`;

      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (backdrop) backdrop.addEventListener('click', closeLightbox);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });
}

/* ====================================================================
   10. FORMULÁRIO DE CONTATO & CÓPIA DE E-MAIL
   ==================================================================== */
function initContactFormAndCopy() {
  // Cópia de E-mail com Um Clique
  const copyBtn = document.getElementById('copyEmailBtn');
  const emailTextEl = document.getElementById('emailToCopy');
  const toast = document.getElementById('copyToast');

  if (copyBtn && emailTextEl) {
    copyBtn.addEventListener('click', async () => {
      const email = emailTextEl.textContent.trim();
      try {
        await navigator.clipboard.writeText(email);
        if (toast) {
          toast.classList.add('show');
          setTimeout(() => {
            toast.classList.remove('show');
          }, 3200);
        }
      } catch (err) {
        // Fallback clássico caso clipboard falhe
        const tempInput = document.createElement('input');
        tempInput.value = email;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        if (toast) {
          toast.classList.add('show');
          setTimeout(() => {
            toast.classList.remove('show');
          }, 3200);
        }
      }
    });
  }

  // Validação e Envio do Formulário de Contato
  const form = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const successMsg = document.getElementById('formSuccessMessage');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('userName');
      const emailInput = document.getElementById('userEmail');
      const messageInput = document.getElementById('userMessage');

      let isValid = true;

      // Validação do Nome
      if (!nameInput.value.trim()) {
        setFieldError(nameInput, true);
        isValid = false;
      } else {
        setFieldError(nameInput, false);
      }

      // Validação do E-mail
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailInput.value.trim())) {
        setFieldError(emailInput, true);
        isValid = false;
      } else {
        setFieldError(emailInput, false);
      }

      // Validação da Mensagem
      if (!messageInput.value.trim()) {
        setFieldError(messageInput, true);
        isValid = false;
      } else {
        setFieldError(messageInput, false);
      }

      if (!isValid) return;

      // Feedback de Carregamento
      if (submitBtn) {
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
      }

      // Simulação realista de envio assíncrono com feedback
      setTimeout(() => {
        if (submitBtn) {
          submitBtn.classList.remove('loading');
          submitBtn.disabled = false;
        }

        form.reset();

        if (successMsg) {
          successMsg.classList.add('show');
          setTimeout(() => {
            successMsg.classList.remove('show');
          }, 6000);
        }

        // Celebração leve no 3D
        if (window.luxuryThreeInstance) {
          window.luxuryThreeInstance.burstReaction();
        }
      }, 1200);
    });
  }

  function setFieldError(inputEl, hasError) {
    const parentGroup = inputEl.closest('.form-group');
    if (parentGroup) {
      if (hasError) {
        parentGroup.classList.add('has-error');
      } else {
        parentGroup.classList.remove('has-error');
      }
    }
  }

  // Atualiza ano atual no rodapé
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

