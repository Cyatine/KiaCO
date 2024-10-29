document.addEventListener('DOMContentLoaded', () => {
    const formTitle = document.getElementById('form-title');
    const formDescription = document.getElementById('form-description');
    const submitBtn = document.getElementById('submit-btn');
    const toggleFormLink = document.getElementById('toggle-form');
    const loginForm = document.getElementById('loginForm');
    const toggleText = document.getElementById('toggle-text');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    let isSignUpMode = false;

    const isUsernameValid = (username) => {
        return /[A-Z]/.test(username);
    };

    const updateForm = () => {
        usernameInput.value = '';
        passwordInput.value = '';

        if (isSignUpMode) {
            formTitle.textContent = 'Sign Up';
            formDescription.textContent = 'Create a new account';
            submitBtn.textContent = 'Sign Up';
            toggleText.innerHTML = "Already have an account? <a href='#' id='login-link'>Login</a>";

            const loginLink = document.getElementById('login-link');
            if (loginLink) {
                loginLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    isSignUpMode = false;
                    updateForm();
                });
            }
        } else {
            formTitle.textContent = 'Login';
            formDescription.textContent = 'Enter your username and password';
            submitBtn.textContent = 'Login';
            toggleText.innerHTML = "Don't have an account? <a href='#' id='sign-up-link'>Sign up</a>";

            const signUpLink = document.getElementById('sign-up-link');
            if (signUpLink) {
                signUpLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    isSignUpMode = true;
                    updateForm();
                });
            }
        }
    };

    updateForm();

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = usernameInput.value;
        const password = passwordInput.value;

        if (isSignUpMode) {
            if (!isUsernameValid(username)) {
                alert('Username must contain at least one uppercase letter.');
                return;
            }

            const checkResponse = await fetch(`http://localhost:3000/check-username`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username })
            });

            const checkResult = await checkResponse.json();

            if (!checkResponse.ok) {
                alert(checkResult.message);
                return;
            }

            if (!checkResult.available) {
                alert('Username has already been taken. Please choose another one.');
                return;
            }
        }

        const endpoint = isSignUpMode ? '/signup' : '/login';

        try {
            const response = await fetch(`http://localhost:3000${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const result = await response.json();

            if (response.ok) {
                alert(result.message);
                if (isSignUpMode) {
                    isSignUpMode = false;
                    updateForm();
                }
                window.location.href = '../Main Webpage/E-Commerce/Kia.Co.E-Commerce.html';
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Server error. Please try again later.');
        }
    });
});
