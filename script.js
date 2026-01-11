// Dark/Light Mode Toggle Script
const darkModeToggle = document.getElementById('dark-mode-toggle');

darkModeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode'); // Toggle dark mode
  document.body.classList.toggle('light-mode'); // Toggle light mode

  const isDarkMode = document.body.classList.contains('dark-mode');

  // Change the icon based on dark mode status
  if (isDarkMode) {
    darkModeToggle.innerHTML = '<span class="toggle-icon">🌞</span>'; // Sun icon for dark mode
  } else {
    darkModeToggle.innerHTML = '<span class="toggle-icon">🌙</span>'; // Moon icon for light mode
  }
});
