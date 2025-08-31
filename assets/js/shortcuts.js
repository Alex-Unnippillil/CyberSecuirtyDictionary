(function(){
  let overlay;
  let lastFocused;

  const shortcuts = [
    { key: '/', description: 'Focus search' },
    { key: 'r', description: 'Show random term' },
    { key: 'f', description: 'Toggle favorites' },
    { key: 'd', description: 'Toggle dark mode' },
    { key: '?', description: 'Show this help' }
  ];

  function buildOverlay(){
    overlay = document.createElement('div');
    overlay.id = 'shortcut-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.innerHTML = `
      <div class="overlay-content">
        <h2 id="shortcut-overlay-title">Keyboard Shortcuts</h2>
        <ul>
          ${shortcuts.map(sc => `<li><kbd>${sc.key}</kbd> - ${sc.description}</li>`).join('')}
        </ul>
        <button id="close-shortcut-overlay" aria-label="Close">Close</button>
      </div>`;
    document.body.appendChild(overlay);
    overlay.addEventListener('click', e => {
      if(e.target === overlay) hideOverlay();
    });
    document.getElementById('close-shortcut-overlay').addEventListener('click', hideOverlay);
  }

  function showOverlay(){
    if(!overlay) buildOverlay();
    overlay.style.display = 'flex';
    lastFocused = document.activeElement;
    document.getElementById('close-shortcut-overlay').focus();
  }

  function hideOverlay(){
    if(!overlay) return;
    overlay.style.display = 'none';
    if(lastFocused) lastFocused.focus();
  }

  function isTypingTarget(el){
    const tag = el.tagName;
    return tag === 'INPUT' || tag === 'TEXTAREA' || el.isContentEditable;
  }

  document.addEventListener('keydown', function(e){
    if(isTypingTarget(e.target)) return;

    const open = overlay && overlay.style.display === 'flex';

    if(e.key === '?' || (e.shiftKey && e.key === '/')){
      e.preventDefault();
      showOverlay();
    } else if(open && e.key === 'Escape'){
      e.preventDefault();
      hideOverlay();
    } else if(!open){
      if(e.key === '/' && !e.shiftKey){
        const input = document.getElementById('search') || document.getElementById('search-box');
        if(input){
          e.preventDefault();
          input.focus();
        }
      } else if(e.key === 'r'){
        const btn = document.getElementById('random-term');
        if(btn){
          e.preventDefault();
          btn.click();
        }
      } else if(e.key === 'f'){
        const fav = document.getElementById('show-favorites');
        if(fav){
          e.preventDefault();
          fav.click();
        }
      } else if(e.key === 'd'){
        const dark = document.getElementById('dark-mode-toggle');
        if(dark){
          e.preventDefault();
          dark.click();
        }
      }
    }
  });
})();
