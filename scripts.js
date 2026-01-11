// document.addEventListener('DOMContentLoaded', function() {
//   // Form validation
//   const form = document.querySelector('.contact-form form');
//   form.addEventListener('submit', function(event) {
//     event.preventDefault();
//     // Basic validation
//     const name = form.name.value.trim();
//     const email = form.email.value.trim();
//     const message = form.message.value.trim();
//     if (name && email && message) {
//       alert('Message sent successfully!');
//       form.reset();
//     } else {
//       alert('Please fill in all fields.');
//     }
//   });

//   // Animations on scroll
//   const elements = document.querySelectorAll('.fade-in');
//   const observer = new IntersectionObserver((entries) => {
//     entries.forEach(entry => {
//       if (entry.isIntersecting) {
//         entry.target.classList.add('visible');
//       }
//     });
//   }, { threshold: 0.1 });

//   elements.forEach(element => {
//     observer.observe(element);
//   });

//   // Dark mode toggle with default light mode
//   const toggleButton = document.getElementById('dark-mode-toggle');
//   const body = document.body;
//   const toggleIcon = document.querySelector('.toggle-icon');

//   // Default to light mode if no preference is saved
//   const currentTheme = localStorage.getItem('theme') || 'light-mode';
//   body.classList.add(currentTheme);
//   updateToggleIcon(currentTheme);

//   toggleButton.addEventListener('click', function() {
//     body.classList.toggle('dark-mode');
//     body.classList.toggle('light-mode');

//     const newTheme = body.classList.contains('dark-mode') ? 'dark-mode' : 'light-mode';
//     localStorage.setItem('theme', newTheme);
//     updateToggleIcon(newTheme);
//   });

//   function updateToggleIcon(theme) {
//     toggleIcon.textContent = theme === 'dark-mode' ? '🌙' : '☀️';
//   }

//   // Add this to your existing DOMContentLoaded event listener
//   const skillsSection = document.querySelector('.skills-container');
//   const skillsObserver = new IntersectionObserver(
//     (entries) => {
//       entries.forEach(entry => {
//         if (entry.isIntersecting) {
//           entry.target.querySelectorAll('.skill-category').forEach(category => {
//             category.style.animationPlayState = 'running';
//           });
//           skillsObserver.unobserve(entry.target);
//         }
//       });
//     },
//     { threshold: 0.2 }
//   );

//   if (skillsSection) {
//     skillsObserver.observe(skillsSection);
//   }
// });

// // Initialize skill bars
// function initSkillBars() {
//   const skillBars = document.querySelectorAll('.skill-progress');

//   skillBars.forEach(bar => {
//     const progress = bar.getAttribute('data-progress');
//     setTimeout(() => {
//       bar.style.width = `${progress}%`;
//     }, 500);
//   });
// }

// // Call initSkillBars when the page loads
// document.addEventListener('DOMContentLoaded', initSkillBars);


//scripts.js

//scripts.js

document.addEventListener('DOMContentLoaded', function () {

  // Form validation and email opening
  const form = document.querySelector('.contact-form form');
  form.addEventListener('submit', function (event) {
    event.preventDefault();

    // Get form values
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    if (name && email && message) {
      // Your email address where you want to receive messages
      const receiverEmail = 'saipratyushagorapalli@gmail.com';

      // Create email subject and body
      const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
      const body = encodeURIComponent(
        `Name: ${name}\n` +
        `Email: ${email}\n\n` +
        `Message:\n${message}\n\n` +
        `---\nSent from portfolio contact form`
      );

      // Open default email client with pre-filled data
      window.location.href = `mailto:${receiverEmail}?subject=${subject}&body=${body}`;

      // Optional: Show success message and reset form
      setTimeout(() => {
        alert('Email client opened! Please send the email from your email application.');
        form.reset();
      }, 500);

    } else {
      alert('Please fill in all fields.');
    }
  });

  // Animations on scroll
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

  // Dark mode toggle with default light mode
  const toggleButton = document.getElementById('dark-mode-toggle');
  const body = document.body;
  const toggleIcon = document.querySelector('.toggle-icon');

  // Default to light mode if no preference is saved
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
    toggleIcon.textContent = theme === 'dark-mode' ? '☀️' : '🌙';
  }

  // Skills animation
  const skillsSection = document.querySelector('.skills-container');
  const skillsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.skill-category').forEach(category => {
            category.style.animationPlayState = 'running';
          });
          skillsObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  if (skillsSection) {
    skillsObserver.observe(skillsSection);
  }

  // Initialize skill bars
  function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    skillBars.forEach(bar => {
      const progress = bar.getAttribute('data-progress');
      setTimeout(() => {
        bar.style.width = `${progress}%`;
      }, 500);
    });
  }

  // Call initSkillBars
  initSkillBars();
});