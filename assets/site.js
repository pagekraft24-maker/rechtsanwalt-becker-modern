(function () {
  var header = document.querySelector('[data-header]');
  var btn = document.querySelector('[data-menu-toggle]');
  var menu = document.getElementById('mobile-menu');

  // Mobiles Menü
  if (btn && menu) {
    btn.addEventListener('click', function () {
      var open = menu.hasAttribute('hidden');
      if (open) { menu.removeAttribute('hidden'); } else { menu.setAttribute('hidden', ''); }
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
      if (header) header.classList.toggle('menu-open', open);
      var i = btn.querySelector('i');
      if (i) { i.classList.toggle('ri-menu-3-line', !open); i.classList.toggle('ri-close-line', open); }
    });
  }

  // Header über dem Startseiten-Bild: beim Scrollen hell hinterlegen
  if (header && header.classList.contains('is-overlay')) {
    var onScroll = function () { header.classList.toggle('is-scrolled', window.scrollY > 40); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // Sanftes Einblenden beim Scrollen
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('is-visible'); });
  }

  // Kontaktformular
  var form = document.querySelector('[data-contact-form]');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var status = form.querySelector('.form-status');
      if (!status) {
        status = document.createElement('p');
        status.className = 'form-status';
        status.setAttribute('role', 'status');
        form.appendChild(status);
      }
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var hp = form.querySelector('[name="phone_alt"]');
      if (hp && hp.value.trim() !== '') { status.className = 'form-status ok'; status.textContent = 'Vielen Dank! Ihre Nachricht wurde gesendet.'; form.reset(); return; }
      var submit = form.querySelector('[type="submit"]');
      if (submit) submit.disabled = true;
      var data = new URLSearchParams(new FormData(form));
      data.delete('phone_alt');
      fetch(form.action, { method: 'POST', body: data, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
        .then(function (r) {
          if (!r.ok) throw new Error(r.status);
          status.className = 'form-status ok';
          status.textContent = 'Vielen Dank! Ihre Nachricht wurde gesendet. Wir melden uns schnellstmöglich bei Ihnen.';
          form.reset();
        })
        .catch(function () {
          status.className = 'form-status err';
          status.textContent = 'Die Nachricht konnte nicht gesendet werden. Bitte rufen Sie uns an oder schreiben Sie an kontakt@rechtsanwalt-becker.eu.';
        })
        .finally(function () { if (submit) submit.disabled = false; });
    });
  }
})();
