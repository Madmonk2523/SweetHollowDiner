document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const menuButton = document.querySelector('[data-menu-toggle]');
  const drawer = document.querySelector('[data-mobile-drawer]');
  const overlay = document.querySelector('[data-drawer-overlay]');
  const panel = document.querySelector('[data-drawer-panel]');
  const backToTop = document.querySelector('[data-back-to-top]');
  let lastFocused = null;

  /* Hours lookup for "Today" card */
  const hours = {
    sunday: '7 AM–9 PM',
    monday: '7 AM–9 PM',
    tuesday: '7 AM–9 PM',
    wednesday: '7 AM–9 PM',
    thursday: '7 AM–9 PM',
    friday: '7 AM–10 PM',
    saturday: '7 AM–10 PM',
  };

  const setTodayHours = () => {
    const todayEl = document.querySelector('[data-today-hours]');
    if (!todayEl) return;
    const todayKey = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const todayHours = hours[todayKey];
    todayEl.textContent = todayHours ? `Today: ${todayHours}` : 'Hours: See schedule below';
  };

  /* Mobile drawer behaviors */
  const getFocusable = () => {
    if (!panel) return [];
    return Array.from(panel.querySelectorAll('a, button, textarea, input, select, [tabindex]:not([tabindex="-1"])'))
      .filter(el => !el.hasAttribute('disabled'));
  };

  const trapFocus = (event) => {
    if (!drawer?.classList.contains('open')) return;
    const focusable = getFocusable();
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.key === 'Tab') {
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  };

  const openDrawer = () => {
    if (!drawer || !menuButton) return;
    lastFocused = document.activeElement;
    drawer.classList.add('open');
    body.classList.add('nav-open');
    menuButton.setAttribute('aria-expanded', 'true');
    const focusable = getFocusable();
    (focusable[0] || menuButton).focus();
    document.addEventListener('keydown', trapFocus);
  };

  const closeDrawer = () => {
    if (!drawer || !menuButton) return;
    drawer.classList.remove('open');
    body.classList.remove('nav-open');
    menuButton.setAttribute('aria-expanded', 'false');
    document.removeEventListener('keydown', trapFocus);
    if (lastFocused) {
      lastFocused.focus();
    } else {
      menuButton.focus();
    }
  };

  menuButton?.addEventListener('click', () => {
    const isOpen = drawer?.classList.contains('open');
    if (isOpen) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  overlay?.addEventListener('click', () => closeDrawer());

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && drawer?.classList.contains('open')) {
      closeDrawer();
    }
  });

  panel?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => closeDrawer());
  });

  /* Back to top button */
  const toggleBackToTop = () => {
    if (!backToTop) return;
    const scrolled = window.scrollY > 300;
    backToTop.classList.toggle('visible', scrolled);
  };

  backToTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  window.addEventListener('scroll', toggleBackToTop);

  /* Scroll reveal */
  const initReveal = () => {
    const elements = document.querySelectorAll('.reveal');
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      elements.forEach(el => el.classList.add('visible'));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    elements.forEach(el => observer.observe(el));
  };

  /* Contact form (frontend only) */
  const initContactForm = () => {
    const form = document.querySelector('[data-contact-form]');
    if (!form) return;
    const alert = form.querySelector('[data-contact-alert]');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.querySelector('input[name="name"]');
      const email = form.querySelector('input[name="email"]');
      const message = form.querySelector('textarea[name="message"]');
      const emailValid = /.+@.+\..+/.test(email.value.trim());
      if (!name.value.trim() || !emailValid || !message.value.trim()) {
        alert.textContent = 'Please complete all fields with a valid email.';
        alert.style.display = 'block';
        alert.style.background = '#fff4e5';
        alert.style.borderColor = '#f7d7b5';
        alert.style.color = '#7a4b1c';
        return;
      }
      alert.textContent = 'Thanks! Your message has been noted. We will be in touch soon.';
      alert.style.display = 'block';
      alert.style.background = '#ecf7ee';
      alert.style.borderColor = '#cfe8d4';
      alert.style.color = '#225d32';
      form.reset();
    });
  };

  setTodayHours();
  initReveal();
  initContactForm();
  toggleBackToTop();
});
