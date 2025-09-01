// Simple lightbox component with keyboard and swipe navigation
(function () {
  document.addEventListener('DOMContentLoaded', initLightbox);

  function initLightbox() {
    const figures = Array.from(document.querySelectorAll('figure[data-lightbox]'));
    if (!figures.length) return;

    const images = figures.map((fig, idx) => {
      const img = fig.querySelector('img');
      const captionText = fig.dataset.caption || fig.querySelector('figcaption')?.textContent || '';
      const source = fig.dataset.source || '';
      let figcaption = fig.querySelector('figcaption');
      if (!figcaption) {
        figcaption = document.createElement('figcaption');
        fig.appendChild(figcaption);
      }
      figcaption.textContent = `Figure ${idx + 1}: ${captionText}${source ? ` (Source: ${source})` : ''}`;
      fig.dataset.index = idx;
      fig.addEventListener('click', () => openLightbox(idx));
      const preloadImg = new Image();
      preloadImg.src = img.src;
      return { src: img.src, caption: figcaption.textContent };
    });

    let currentIndex = 0;
    const overlay = buildOverlay();
    const overlayImg = overlay.querySelector('.lightbox-image');
    const captionEl = overlay.querySelector('.lightbox-caption');

    function buildOverlay() {
      const overlay = document.createElement('div');
      overlay.className = 'lightbox';
      overlay.innerHTML = `
        <button class="lightbox-close" aria-label="Close">&times;</button>
        <button class="lightbox-prev" aria-label="Previous">&#10094;</button>
        <img class="lightbox-image" alt="">
        <button class="lightbox-next" aria-label="Next">&#10095;</button>
        <p class="lightbox-caption"></p>`;
      document.body.appendChild(overlay);
      overlay.querySelector('.lightbox-close').addEventListener('click', close);
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) close();
      });
      overlay.querySelector('.lightbox-prev').addEventListener('click', showPrev);
      overlay.querySelector('.lightbox-next').addEventListener('click', showNext);
      // Keyboard navigation
      document.addEventListener('keydown', (e) => {
        if (!overlay.classList.contains('visible')) return;
        if (e.key === 'Escape') close();
        if (e.key === 'ArrowRight') showNext();
        if (e.key === 'ArrowLeft') showPrev();
      });
      // Swipe navigation
      let startX = 0;
      overlay.addEventListener('touchstart', (e) => {
        startX = e.changedTouches[0].screenX;
      });
      overlay.addEventListener('touchend', (e) => {
        const diff = e.changedTouches[0].screenX - startX;
        if (diff > 50) showPrev();
        if (diff < -50) showNext();
      });
      return overlay;
    }

    function openLightbox(index) {
      currentIndex = index;
      updateLightbox();
      overlay.classList.add('visible');
      preload(index - 1);
      preload(index + 1);
    }

    function close() {
      overlay.classList.remove('visible');
    }

    function showNext() {
      currentIndex = (currentIndex + 1) % images.length;
      updateLightbox();
      preload(currentIndex + 1);
    }

    function showPrev() {
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      updateLightbox();
      preload(currentIndex - 1);
    }

    function updateLightbox() {
      overlayImg.src = images[currentIndex].src;
      captionEl.textContent = images[currentIndex].caption;
    }

    function preload(index) {
      if (index < 0 || index >= images.length) return;
      const img = new Image();
      img.src = images[index].src;
    }
  }
})();

