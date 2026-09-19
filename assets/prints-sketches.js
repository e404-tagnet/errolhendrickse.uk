(function () {
  'use strict';

  const PRINTS = [];
  const SKETCHES = [];

  function buildSlide(item) {
    return `
      <div class="carousel-slide">
        <div class="artwork-frame">
          <img src="${item.src}" alt="${item.alt || ''}" loading="lazy" />
          <div class="artwork-caption">
            <span class="artwork-title">${item.title || 'Untitled'}</span>
            ${item.price ? `<span class="artwork-price">${item.price}</span>` : ''}
          </div>
        </div>
        ${item.description ? `<div class="artwork-info"><p>${item.description}</p></div>` : ''}
      </div>`;
  }

  function renderEmpty(trackId, dotsId, label) {
    const track = document.getElementById(trackId);
    const dots = document.getElementById(dotsId);
    if (!track) return;
    track.innerHTML = `
      <div class="carousel-slide">
        <div class="artwork-frame empty-frame">
          <div class="empty-state">
            <p>${label} — coming soon.</p>
          </div>
        </div>
      </div>`;
    if (dots) dots.innerHTML = '';
  }

  function initCarousel(trackId, dotsId, items) {
    const track = document.getElementById(trackId);
    const dots = document.getElementById(dotsId);
    if (!track) return;
    if (!items || items.length === 0) {
      renderEmpty(trackId, dotsId, trackId.replace('-track', '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()));
      return;
    }

    track.innerHTML = items.map(buildSlide).join('');
    if (dots) {
      dots.innerHTML = items.map((_, i) => `<button class="dot${i === 0 ? ' active' : ''}" data-index="${i}" aria-label="Go to slide ${i + 1}"></button>`).join('');
    }

    let current = 0;
    const slides = track.querySelectorAll('.carousel-slide');

    function goTo(index) {
      if (!slides.length) return;
      current = Math.max(0, Math.min(index, slides.length - 1));
      track.parentElement.scrollTo({ left: current * track.parentElement.clientWidth, behavior: 'smooth' });
      updateDots();
    }

    function updateDots() {
      if (!dots) return;
      dots.querySelectorAll('.dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === current);
      });
    }

    document.querySelectorAll(`button[data-target="${trackId}"]`).forEach(btn => {
      btn.addEventListener('click', () => {
        const dir = parseInt(btn.dataset.dir, 10);
        goTo(current + dir);
      });
    });

    if (dots) {
      dots.addEventListener('click', e => {
        if (e.target.classList.contains('dot')) {
          goTo(parseInt(e.target.dataset.index, 10));
        }
      });
    }

    track.parentElement.addEventListener('scroll', () => {
      const width = track.parentElement.clientWidth;
      const index = Math.round(track.parentElement.scrollLeft / width);
      if (index !== current) {
        current = index;
        updateDots();
      }
    }, { passive: true });
  }

  function init() {
    initCarousel('prints-track', 'prints-dots', PRINTS);
    initCarousel('sketches-track', 'sketches-dots', SKETCHES);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
