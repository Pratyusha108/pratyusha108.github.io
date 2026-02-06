document.addEventListener('DOMContentLoaded', function () {

  // Form validation and email opening
  const form = document.querySelector('.contact-form form');
  if (!form) return;

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    if (name && email && message) {
      const receiverEmail = 'saipratyushagorapalli@gmail.com';

      const subject = encodeURIComponent('Portfolio Contact from ' + name);
      const body = encodeURIComponent(
        'Name: ' + name + '\n' +
        'Email: ' + email + '\n\n' +
        'Message:\n' + message + '\n\n' +
        '---\nSent from portfolio contact form'
      );

      window.location.href = 'mailto:' + receiverEmail + '?subject=' + subject + '&body=' + body;

      setTimeout(function () {
        alert('Email client opened! Please send the email from your email application.');
        form.reset();
      }, 500);

    } else {
      alert('Please fill in all fields.');
    }
  });

});
