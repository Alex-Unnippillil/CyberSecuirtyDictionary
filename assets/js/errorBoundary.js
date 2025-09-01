(function () {
  class ErrorBoundary {
    constructor() {
      this.modal = null;
    }

    install() {
      this.restoreIfNeeded();
      this.setupPersistence();
      window.addEventListener('error', (e) => this.handleError(e.error || e));
      window.addEventListener('unhandledrejection', (e) => this.handleError(e.reason));
    }

    setupPersistence() {
      const saveRoute = () => {
        try {
          sessionStorage.setItem('lastRoute', window.location.href);
        } catch (_) {}
      };
      const saveScroll = () => {
        try {
          sessionStorage.setItem('lastScroll', String(window.scrollY));
        } catch (_) {}
      };
      saveRoute();
      saveScroll();
      window.addEventListener('hashchange', saveRoute);
      window.addEventListener('beforeunload', saveRoute);
      window.addEventListener('scroll', saveScroll);
    }

    handleError(err) {
      console.error('Captured error:', err);
      this.showModal();
    }

    showModal() {
      if (this.modal) return;
      this.modal = document.createElement('div');
      this.modal.id = 'error-modal';
      this.modal.innerHTML =
        '<div class="modal-content"><p>Something went wrong.</p><button id="restore-session" type="button">Restore</button></div>';
      document.body.appendChild(this.modal);
      const btn = document.getElementById('restore-session');
      btn.addEventListener('click', () => {
        try {
          sessionStorage.setItem('restoreFlag', 'true');
        } catch (_) {}
        const route = sessionStorage.getItem('lastRoute') || window.location.href;
        window.location.href = route;
      });
    }

    restoreIfNeeded() {
      if (sessionStorage.getItem('restoreFlag') === 'true') {
        sessionStorage.removeItem('restoreFlag');
        const scroll = parseInt(sessionStorage.getItem('lastScroll'), 10);
        if (!isNaN(scroll)) {
          window.scrollTo(0, scroll);
        }
      }
    }
  }

  const boundary = new ErrorBoundary();
  boundary.install();
})();
