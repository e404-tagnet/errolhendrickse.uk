(function () {
  'use strict';

  const TYPE_SPEED = 13.5; // ms per character (25% faster than 18)
  const PARAGRAPH_GAP = 338; // ms between paragraphs (25% faster than 450)
  const TITLE_DELAY = 225; // ms (25% faster than 300)
  const IMAGE_FADE_DELAY = 0; // image starts fading in immediately with text

  function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async function typeWriter(element, text) {
    element.textContent = '';
    element.classList.add('is-typing');
    for (let i = 0; i < text.length; i++) {
      element.textContent += text.charAt(i);
      const char = text.charAt(i);
      const delay = char === ' ' || char === '\n' ? TYPE_SPEED * 0.6 : TYPE_SPEED;
      await wait(delay);
    }
    element.classList.remove('is-typing');
  }

  function collectTextNodes(root) {
    const paragraphs = [];
    root.querySelectorAll('p, .red-line-verse').forEach(p => {
      const clone = p.cloneNode(true);
      const text = clone.textContent.trim();
      if (text) paragraphs.push({ element: p, text });
    });
    return paragraphs;
  }

  function animateRow(row, isFirst) {
    const heading = row.querySelector('h2');
    const paragraphs = collectTextNodes(row);
    const image = row.querySelector('.about-row-image img');

    if (heading) {
      heading.classList.add('about-reveal-hidden');
    }
    paragraphs.forEach(({ element }) => {
      element.classList.add('about-reveal-hidden');
    });
    if (image) {
      image.classList.add('about-image-hidden');
    }

    return new Promise(resolve => {
      setTimeout(async () => {
        if (heading) {
          heading.classList.remove('about-reveal-hidden');
          heading.classList.add('about-reveal-visible');
          if (image) {
            image.classList.remove('about-image-hidden');
            image.classList.add('about-image-visible');
          }
          await wait(TITLE_DELAY);
        }

        for (let i = 0; i < paragraphs.length; i++) {
          const { element, text } = paragraphs[i];
          element.classList.remove('about-reveal-hidden');
          element.classList.add('about-reveal-visible');
          await typeWriter(element, text);
          if (i < paragraphs.length - 1) {
            await wait(PARAGRAPH_GAP);
          }
        }

        if (image) {
          setTimeout(() => {
            image.classList.remove('about-image-hidden');
            image.classList.add('about-image-visible');
          }, IMAGE_FADE_DELAY);
        }

        resolve();
      }, isFirst ? 400 : 150);
    });
  }

  async function runAboutAnimation() {
    const rows = document.querySelectorAll('.about-row');
    for (let i = 0; i < rows.length; i++) {
      await animateRow(rows[i], i === 0);
      await wait(600);
    }
  }

  function init() {
    const aboutMain = document.querySelector('.about-page-main');
    if (!aboutMain) return;

    // Prepare: hide all content until animation runs
    aboutMain.classList.add('about-anim-ready');
    runAboutAnimation();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
renamed '/tmp/hermes-snap-1b96dfbba94a.sh.tmp.nUv3lPFdoQ' -> '/tmp/hermes-snap-1b96dfbba94a.sh'
