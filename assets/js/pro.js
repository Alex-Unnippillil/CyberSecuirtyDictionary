(function(){
  const STORAGE_KEY = 'proMode';
  const PARAM = 'pro';

  function updateUrl(enabled){
    const url = new URL(window.location.href);
    if(enabled){
      url.searchParams.set(PARAM,'1');
    } else {
      url.searchParams.delete(PARAM);
    }
    window.history.replaceState({}, '', url);
  }

  function isEnabled(){
    const params = new URLSearchParams(window.location.search);
    if(params.get(PARAM) === '1'){
      localStorage.setItem(STORAGE_KEY, '1');
      return true;
    }
    return localStorage.getItem(STORAGE_KEY) === '1';
  }

  function applyVisibility(){
    const enabled = isEnabled();
    updateUrl(enabled);
    document.querySelectorAll('[data-pro-only]').forEach(el => {
      el.style.display = enabled ? '' : 'none';
    });
    const toggle = document.getElementById('pro-toggle');
    if(toggle){
      toggle.checked = enabled;
    }
  }

  function setupToggle(){
    const toggle = document.getElementById('pro-toggle');
    if(!toggle) return;
    toggle.addEventListener('change', () => {
      const enabled = toggle.checked;
      if(enabled){
        localStorage.setItem(STORAGE_KEY, '1');
      }else{
        localStorage.removeItem(STORAGE_KEY);
      }
      updateUrl(enabled);
      applyVisibility();
    });
  }

  applyVisibility();
  setupToggle();
})();
