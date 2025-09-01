// JavaScript to overlay numbered pins on diagrams and provide legend navigation
// Scans for elements with the class "diagram" and matches explanatory sections
// containing data attributes with coordinates.

document.addEventListener('DOMContentLoaded', () => {
  const diagrams = document.querySelectorAll('.diagram');
  diagrams.forEach((diagram) => {
    const baseImage = diagram.querySelector('.diagram-image');
    const pinLayer = diagram.querySelector('.pin-layer');
    const legend = diagram.querySelector('.pin-legend');
    const diagramId = diagram.id;
    if (!baseImage || !pinLayer || !legend || !diagramId) return;

    const init = () => {
      const { width, height } = baseImage.getBoundingClientRect();
      pinLayer.setAttribute('viewBox', `0 0 ${width} ${height}`);
      pinLayer.setAttribute('width', width);
      pinLayer.setAttribute('height', height);

      const explanations = document.querySelectorAll(
        `[data-diagram='${diagramId}'][data-pin]`
      );

      explanations.forEach((section, index) => {
        const [xPercent, yPercent] = section.dataset.pin
          .split(',')
          .map(Number);
        const x = (width * xPercent) / 100;
        const y = (height * yPercent) / 100;
        const number = index + 1;
        const label = section.dataset.label || `Pin ${number}`;
        const targetId = section.id;

        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.setAttribute('tabindex', '0');
        g.setAttribute('class', 'diagram-pin');
        g.setAttribute('aria-label', label);
        g.dataset.target = targetId;

        const circle = document.createElementNS(
          'http://www.w3.org/2000/svg',
          'circle'
        );
        circle.setAttribute('cx', String(x));
        circle.setAttribute('cy', String(y));
        circle.setAttribute('r', '12');
        g.appendChild(circle);

        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', String(x));
        text.setAttribute('y', String(y + 4));
        text.setAttribute('text-anchor', 'middle');
        text.textContent = String(number);
        g.appendChild(text);

        const activate = () => {
          const target = document.getElementById(targetId);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
          }
        };

        g.addEventListener('click', activate);
        g.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            activate();
          }
        });

        pinLayer.appendChild(g);

        const li = document.createElement('li');
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = `${number}. ${label}`;
        btn.dataset.target = targetId;
        btn.addEventListener('click', activate);
        li.appendChild(btn);
        legend.appendChild(li);
      });
    };

    if (baseImage instanceof SVGSVGElement || baseImage.complete) {
      init();
    } else {
      baseImage.addEventListener('load', init);
    }
  });
});

