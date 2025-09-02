(function(){
  const KEY = 'settings';
  function read(){
    try {
      return JSON.parse(localStorage.getItem(KEY) || '{}');
    } catch {
      return {};
    }
  }
  function write(data){
    localStorage.setItem(KEY, JSON.stringify(data));
    window.dispatchEvent(new Event('storage'));
  }
  function apply(){
    const data = read();
    const toggle = document.getElementById('hinting-toggle');
    if(toggle){
      toggle.checked = data.enhancedHinting !== false;
    }
  }
  function setup(){
    const toggle = document.getElementById('hinting-toggle');
    if(!toggle) return;
    toggle.addEventListener('change', () => {
      const data = read();
      data.enhancedHinting = toggle.checked;
      write(data);
    });
  }
  apply();
  setup();
})();
