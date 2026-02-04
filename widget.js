(function () {
  const script = document.currentScript;
  const endpoint = script.getAttribute('data-endpoint') || 'terms.json';

  function init() {
    fetch(endpoint)
      .then((res) => res.json())
      .then((data) => {
        const map = new Map(
          data.terms.map((t) => [t.term.toLowerCase(), t.definition])
        );
        document.querySelectorAll('[data-csd-term]').forEach((el) => {
          const term = el.getAttribute('data-csd-term');
          const definition = map.get(term.toLowerCase());
          if (!definition) return;

          const shadow = el.attachShadow({ mode: 'open' });

          const style = document.createElement('style');
          style.textContent = `
            .csd-widget { font-family: sans-serif; background:#f9f9f9; border:1px solid #ddd; padding:2px 4px; border-radius:3px; font-size:0.875em; }
            .csd-term { font-weight:bold; }
            .csd-definition { margin-left:4px; }
          `;

          const container = document.createElement('span');
          container.className = 'csd-widget';

          const termSpan = document.createElement('span');
          termSpan.className = 'csd-term';
          termSpan.textContent = term;

          const defSpan = document.createElement('span');
          defSpan.className = 'csd-definition';
          defSpan.textContent = definition;

          container.appendChild(termSpan);
          container.appendChild(document.createTextNode(': '));
          container.appendChild(defSpan);

          shadow.appendChild(style);
          shadow.appendChild(container);
        });
      })
      .catch((err) => console.error('Dictionary widget error:', err));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
