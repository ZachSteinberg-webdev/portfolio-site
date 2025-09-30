(function () {
  // Attempt to locate your burger and menu using common patterns or data-attrs.
  const burger =
    document.querySelector('#burger') ||
    document.querySelector('[data-burger]') ||
    document.querySelector('button[aria-controls="navigation"]');

  const menu =
    document.querySelector('#navigation') ||
    document.querySelector('[data-navigation]') ||
    (burger && document.getElementById(burger?.getAttribute('aria-controls')));

  if (!burger || !menu) return; // nothing to do if we can't find them

  // Initialize ARIA state
  burger.setAttribute('aria-expanded', burger.getAttribute('aria-expanded') || 'false');
  menu.setAttribute('aria-hidden', menu.getAttribute('aria-hidden') || 'true');

  function setOpen(isOpen) {
    burger.setAttribute('aria-expanded', String(isOpen));
    menu.setAttribute('aria-hidden', String(!isOpen));
    menu.classList.toggle('open', isOpen);
  }

  // Toggle on click
  burger.addEventListener('click', () => {
    const isOpen = burger.getAttribute('aria-expanded') !== 'true';
    setOpen(isOpen);
    if (isOpen) {
      // Move focus to the first link in the menu for keyboard users
      const firstLink = menu.querySelector('a, button, [tabindex]:not([tabindex="-1"])');
      firstLink && firstLink.focus();
    } else {
      burger.focus();
    }
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && burger.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
    }
  });

  // Optional: close when clicking outside
  document.addEventListener('click', (e) => {
    const open = burger.getAttribute('aria-expanded') === 'true';
    if (!open) return;
    const within = e.target === burger || burger.contains(e.target) || menu.contains(e.target);
    if (!within) setOpen(false);
  });

  // Add a small class to body when scrolled for subtle shadow on header (if you style it)
  window.addEventListener('scroll', () => {
    document.body.classList.toggle('scrolled', window.scrollY > 8);
  }, { passive: true });
})();
