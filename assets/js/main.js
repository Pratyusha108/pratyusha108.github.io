document.addEventListener('DOMContentLoaded', function () {

  // Dark mode toggle with localStorage persistence
  const toggleButton = document.getElementById('dark-mode-toggle');
  const body = document.body;
  const toggleIcon = document.querySelector('.toggle-icon');

  const currentTheme = localStorage.getItem('theme') || 'light-mode';
  body.classList.add(currentTheme);
  updateToggleIcon(currentTheme);

  toggleButton.addEventListener('click', function () {
    body.classList.toggle('dark-mode');
    body.classList.toggle('light-mode');

    const newTheme = body.classList.contains('dark-mode') ? 'dark-mode' : 'light-mode';
    localStorage.setItem('theme', newTheme);
    updateToggleIcon(newTheme);
  });

  function updateToggleIcon(theme) {
    toggleIcon.textContent = theme === 'dark-mode' ? '\u2600\uFE0F' : '\uD83C\uDF19';
  }

  // Scroll animations for .fade-in elements
  const elements = document.querySelectorAll('.fade-in');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  elements.forEach(element => {
    observer.observe(element);
  });

});
