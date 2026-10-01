(() => {
  'use strict';
  if (location.hostname !== 'junsdocs.github.io' || !location.pathname.startsWith('/YangJunHo/')) return;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  const tag = document.createElement('script');
  tag.async = true;
  tag.src = 'https://www.googletagmanager.com/gtag/js?id=G-8192HHNY1D';
  document.head.appendChild(tag);
  gtag('js', new Date());
  gtag('config', 'G-8192HHNY1D', {allow_google_signals: false, allow_ad_personalization_signals: false});
  const send = (name, params = {}) => gtag('event', name, params);
  document.addEventListener('click', (event) => {
    const link = event.target.closest('a');
    if (!link) return;
    const href = link.getAttribute('href') || '';
    if (/^#case-[1-6]$/.test(href)) send('case_click', {case_id: href.slice(1)});
    if (/portfolio\.pdf(?:[?#]|$)/.test(href)) send('portfolio_pdf_click');
    if (href.startsWith('mailto:')) send('contact_click');
  });
  const seen = new Set();
  const timers = new Map();
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      const id = entry.target.id;
      if (entry.isIntersecting && !seen.has(id) && !timers.has(id) && !document.hidden) {
        timers.set(id, setTimeout(() => {
          timers.delete(id);
          if (document.hidden) return;
          seen.add(id);
          send('case_view', {case_id: id});
          observer.unobserve(entry.target);
        }, 1500));
      } else if (!entry.isIntersecting) {
        clearTimeout(timers.get(id)); timers.delete(id);
      }
    }
  }, {threshold: 0, rootMargin: '-20% 0px -20% 0px'});
  const sections = document.querySelectorAll('section[id^="case-"]');
  sections.forEach(section => observer.observe(section));
  document.addEventListener('visibilitychange', () => {
    for (const timer of timers.values()) clearTimeout(timer);
    timers.clear();
    if (!document.hidden) sections.forEach(section => {
      if (!seen.has(section.id)) { observer.unobserve(section); observer.observe(section); }
    });
  });
})();
