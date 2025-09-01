(function(){
  let overlay;
  let input;
  let matches = [];
  let currentIndex = -1;

  function createOverlay(){
    overlay = document.createElement('div');
    overlay.id = 'find-overlay';
    overlay.innerHTML = '<input type="text" id="find-input" aria-label="Find in page" />';
    document.body.appendChild(overlay);
    input = overlay.querySelector('#find-input');
    input.addEventListener('input', handleInput);
    input.addEventListener('keydown', handleKeyDown);
  }

  function handleKeyDown(e){
    if(e.key === 'Enter'){
      e.preventDefault();
      if(e.shiftKey){
        focusPrev();
      } else {
        focusNext();
      }
    } else if(e.key === 'Escape'){
      hideOverlay();
    }
  }

  function handleInput(){
    const query = input.value.trim();
    clearHighlights();
    if(!query){
      matches = [];
      currentIndex = -1;
      return;
    }
    const accs = Array.from(document.querySelectorAll('details, .accordion'));
    const regex = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    accs.forEach(acc => {
      const text = acc.textContent.toLowerCase();
      if(text.includes(query.toLowerCase())){
        if(acc.tagName.toLowerCase() === 'details'){
          acc.open = true;
        } else {
          acc.classList.add('open');
        }
        highlight(acc, regex);
      }
    });
    matches = Array.from(document.querySelectorAll('mark.find-match'));
    if(matches.length){
      focusMatch(0);
    }
  }

  function highlight(node, regex){
    const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, null);
    const nodes = [];
    while(walker.nextNode()){
      nodes.push(walker.currentNode);
    }
    nodes.forEach(textNode => {
      if(regex.test(textNode.textContent)){
        const span = document.createElement('span');
        span.innerHTML = textNode.textContent.replace(regex, match => `<mark class="find-match">${match}</mark>`);
        textNode.parentNode.replaceChild(span, textNode);
      }
    });
  }

  function clearHighlights(){
    document.querySelectorAll('mark.find-match').forEach(m => {
      const text = document.createTextNode(m.textContent);
      m.parentNode.replaceChild(text, m);
    });
    matches = [];
    currentIndex = -1;
  }

  function focusMatch(index){
    if(matches[currentIndex]){
      matches[currentIndex].classList.remove('find-focus');
    }
    currentIndex = index;
    const m = matches[currentIndex];
    if(m){
      m.classList.add('find-focus');
      m.scrollIntoView({behavior:'smooth', block:'center'});
    }
  }

  function focusNext(){
    if(!matches.length) return;
    const next = (currentIndex + 1) % matches.length;
    focusMatch(next);
  }

  function focusPrev(){
    if(!matches.length) return;
    const prev = (currentIndex - 1 + matches.length) % matches.length;
    focusMatch(prev);
  }

  function hideOverlay(){
    overlay.style.display = 'none';
    clearHighlights();
  }

  document.addEventListener('keydown', e => {
    const isFind = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'f';
    if(isFind){
      e.preventDefault();
      if(!overlay){
        createOverlay();
      }
      overlay.style.display = 'block';
      input.focus();
      input.select();
    } else if(e.key === 'Escape' && overlay && overlay.style.display !== 'none'){
      hideOverlay();
    }
  });
})();
