// Theme toggling and footer year update
// Updates footer year and toggles site theme with persistence

document.addEventListener('DOMContentLoaded', () => {
  // Update footer year
  const yearSpan = document.getElementById('year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // Theme toggle logic
  const themeToggle = document.getElementById('theme-toggle');
  if (!themeToggle) return;

  const root = document.documentElement;
  const storedTheme = localStorage.getItem('theme') || 'light';
  root.setAttribute('data-theme', storedTheme);
  document.body.classList.toggle('dark-mode', storedTheme === 'dark');
  themeToggle.setAttribute('aria-pressed', storedTheme === 'dark');

  themeToggle.addEventListener('click', () => {
    const currentTheme = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', newTheme);
    document.body.classList.toggle('dark-mode', newTheme === 'dark');
    themeToggle.setAttribute('aria-pressed', newTheme === 'dark');
    try {
      localStorage.setItem('theme', newTheme);
    } catch (e) {
      // Ignore storage errors
    }
  });
});

