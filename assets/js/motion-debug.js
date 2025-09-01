(function(){
  function createOverlayContainer(){
    const overlay = document.createElement('div');
    overlay.id = 'motion-debug-overlay';
    Object.assign(overlay.style, {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      zIndex: 99999
    });
    document.body.appendChild(overlay);
    return overlay;
  }

  function showLayoutRegions(overlay){
    const items = Array.from(document.querySelectorAll('[data-layout-id]'));
    const regions = items.map((el) => {
      const region = document.createElement('div');
      Object.assign(region.style, {
        position: 'absolute',
        border: '1px dashed red',
        boxSizing: 'border-box'
      });
      const label = document.createElement('span');
      label.textContent = el.getAttribute('data-layout-id');
      Object.assign(label.style, {
        position: 'absolute',
        top: 0,
        left: 0,
        background: 'rgba(255,0,0,0.7)',
        color: '#fff',
        fontSize: '10px',
        padding: '1px 2px'
      });
      region.appendChild(label);
      overlay.appendChild(region);
      return { el, region };
    });

    function update(){
      regions.forEach(({el, region}) => {
        const rect = el.getBoundingClientRect();
        region.style.top = `${rect.top + window.scrollY}px`;
        region.style.left = `${rect.left + window.scrollX}px`;
        region.style.width = `${rect.width}px`;
        region.style.height = `${rect.height}px`;
      });
      requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  function setupPaintFlashes(overlay){
    const observer = new MutationObserver((mutations) => {
      const flashed = new Set();
      mutations.forEach((m) => {
        const target = m.target;
        if (flashed.has(target)) return;
        flashed.add(target);
        const rect = target.getBoundingClientRect();
        const flash = document.createElement('div');
        Object.assign(flash.style, {
          position: 'absolute',
          background: 'rgba(0,255,0,0.3)',
          top: `${rect.top + window.scrollY}px`,
          left: `${rect.left + window.scrollX}px`,
          width: `${rect.width}px`,
          height: `${rect.height}px`
        });
        overlay.appendChild(flash);
        setTimeout(() => flash.remove(), 100);
      });
    });
    observer.observe(document.body, { attributes: true, childList: true, subtree: true });
  }

  function setupFPSCounter(overlay){
    const fps = document.createElement('div');
    Object.assign(fps.style, {
      position: 'fixed',
      top: '0',
      right: '0',
      background: 'rgba(0,0,0,0.7)',
      color: '#0f0',
      fontFamily: 'monospace',
      fontSize: '12px',
      padding: '2px 4px',
      zIndex: 100000
    });
    overlay.appendChild(fps);
    let frames = 0;
    let last = performance.now();
    function loop(now){
      frames++;
      if(now - last >= 1000){
        fps.textContent = `${frames} FPS`;
        frames = 0;
        last = now;
      }
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  }

  window.initMotionDebug = function(){
    const overlay = createOverlayContainer();
    showLayoutRegions(overlay);
    setupPaintFlashes(overlay);
    setupFPSCounter(overlay);
  };
})();
