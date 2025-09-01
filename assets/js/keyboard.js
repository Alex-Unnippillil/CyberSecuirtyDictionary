(function(){
  function initOnScreenKeyboard(input){
    const toggleButton = document.getElementById('toggle-keyboard');
    const keyboard = document.getElementById('special-char-keyboard');
    if(!toggleButton || !keyboard || !input) return;

    const chars = ['á','é','í','ó','ú','ñ','ü','ç','ø','ß','æ','œ'];
    const keys = [];
    chars.forEach((ch, index) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'key';
      btn.textContent = ch;
      btn.setAttribute('tabindex', index === 0 ? '0' : '-1');
      btn.addEventListener('click', () => insertChar(ch));
      btn.addEventListener('keydown', handleKeydown);
      keyboard.appendChild(btn);
      keys.push(btn);
    });

    const cols = 6;

    function handleKeydown(e){
      const idx = keys.indexOf(document.activeElement);
      let next = idx;
      if(e.key === 'ArrowRight') next = (idx + 1) % keys.length;
      else if(e.key === 'ArrowLeft') next = (idx - 1 + keys.length) % keys.length;
      else if(e.key === 'ArrowDown') next = (idx + cols) % keys.length;
      else if(e.key === 'ArrowUp') next = (idx - cols + keys.length) % keys.length;
      else if(e.key === 'Escape'){
        toggle(false);
        toggleButton.focus();
        return;
      } else {
        return;
      }
      keys.forEach(k => k.tabIndex = -1);
      keys[next].tabIndex = 0;
      keys[next].focus();
      e.preventDefault();
    }

    function insertChar(ch){
      const start = input.selectionStart || 0;
      const end = input.selectionEnd || 0;
      const value = input.value;
      input.value = value.slice(0,start) + ch + value.slice(end);
      const pos = start + ch.length;
      input.focus();
      input.setSelectionRange(pos, pos);
      input.dispatchEvent(new Event('input', {bubbles:true}));
    }

    function toggle(show){
      keyboard.hidden = !show;
      toggleButton.setAttribute('aria-expanded', String(show));
    }

    toggleButton.addEventListener('click', () => {
      toggle(keyboard.hidden);
      input.focus();
    });
  }
  window.initOnScreenKeyboard = initOnScreenKeyboard;
})();
