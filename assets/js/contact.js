document.addEventListener('DOMContentLoaded', function () {

  // Form validation and email opening
  var form = document.querySelector('form.contact-form');
  if (!form) return;

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    var name = form.querySelector('#name').value.trim();
    var email = form.querySelector('#email').value.trim();
    var subjectVal = form.querySelector('#subject').value.trim();
    var message = form.querySelector('#message').value.trim();

    if (name && email && subjectVal && message) {
      var receiverEmail = 'saipratyushagorapalli@gmail.com';

      var subject = encodeURIComponent(subjectVal + ' - from ' + name);
      var body = encodeURIComponent(
        'Name: ' + name + '\n' +
        'Email: ' + email + '\n\n' +
        message
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
