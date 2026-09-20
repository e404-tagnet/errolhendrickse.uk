(function () {
  'use strict';

  const STAGGER = 120; // ms between elements

  function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async function animateRow(row, isFirst) {
    const heading = row.querySelector('h2');
    const paragraphs = row.querySelectorAll('p');
    const image = row.querySelector('.about-row-image img');

    [heading, ...paragraphs, image].forEach(el => {
      if (el) el.classList.add('about-fade-hidden');
    });

    await wait(isFirst ? 300 : 150);

    if (heading) {
      heading.classList.remove('about-fade-hidden');
      heading.classList.add('about-fade-visible');
    }

    for (let i = 0; i < paragraphs.length; i++) {
      await wait(STAGGER);
      paragraphs[i].classList.remove('about-fade-hidden');
      paragraphs[i].classList.add('about-fade-visible');
    }

    if (image) {
      await wait(STAGGER);
      image.classList.remove('about-fade-hidden');
      image.classList.add('about-fade-visible');
    }
  }

  async function runAboutAnimation() {
    const rows = document.querySelectorAll('.about-row');
    for (let i = 0; i < rows.length; i++) {
      await animateRow(rows[i], i === 0);
      await wait(400);
    }
  }

  function init() {
    const aboutMain = document.querySelector('.about-page-main');
    if (!aboutMain) return;
    aboutMain.classList.add('about-anim-ready');
    runAboutAnimation();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
