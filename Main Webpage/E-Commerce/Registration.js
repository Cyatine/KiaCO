// JavaScript for switching between forms and basic validation

const showLogin = document.getElementById('show-login');
const showRegister = document.getElementById('show-register');
const registrationForm = document.getElementById('registration-form');
const loginForm = document.getElementById('login-form');

// Switch to login form
showLogin.addEventListener('click', (e) => {
  e.preventDefault();
  registrationForm.classList.add('hidden');
  loginForm.classList.remove('hidden');
});

// Switch to registration form
showRegister.addEventListener('click', (e) => {
  e.preventDefault();
  loginForm.classList.add('hidden');
  registrationForm.classList.remove('hidden');
});

// Register form validation
document.getElementById('register').addEventListener('submit', function (e) {
  e.preventDefault();
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirm-password').value;

  if (password !== confirmPassword) {
    alert('Passwords do not match!');
  } else {
    alert('Registration successful!');
    this.reset();
  }
});

// Login form submission
document.getElementById('login').addEventListener('submit', function (e) {
  e.preventDefault();
  alert('Logged in successfully!');
  this.reset();
});
