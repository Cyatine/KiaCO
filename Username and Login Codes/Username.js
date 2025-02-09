document.addEventListener('DOMContentLoaded', () => {
    // Existing form elements
    const formTitle = document.getElementById('form-title');
    const formDescription = document.getElementById('form-description');
    const submitBtn = document.getElementById('submit-btn'); // Original button
    const toggleText = document.getElementById('toggle-text');
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('error-message');

    const emailGroup = document.getElementById('email-group');
    const addressGroup = document.getElementById('address-group');
    const phoneGroup = document.getElementById('phone-group');
    const secondLoginBtn = document.getElementById('second-login-btn'); // Alternative login button

    let isSignUpMode = false;

    // Check the query parameter 'cartSaved' in the URL to show cart-related messages
    const urlParams = new URLSearchParams(window.location.search);
    const cartSaved = urlParams.get('cartSaved');

    if (cartSaved === 'true') {
        alert('Your cart has been saved successfully!');  // Show this message if the cart was saved
    } else if (cartSaved === 'false') {
        alert('Your cart was empty, no items to save.');  // Show this message if the cart was empty
    }

    // Function to update the form state for login/sign-up
    const updateForm = () => {
        loginForm.reset(); // Clear input fields on mode switch

        if (isSignUpMode) {
            formTitle.textContent = 'Sign Up';
            formDescription.textContent = 'Create a new account';
            submitBtn.textContent = 'Sign Up';
            toggleText.innerHTML = "Already have an account? <a href='#' id='toggle-form'>Login</a>";
            emailGroup.classList.remove('hidden');
            addressGroup.classList.remove('hidden');
            phoneGroup.classList.remove('hidden');

            // Hide the second login button in sign-up mode and show the original button
            submitBtn.classList.remove('hidden');
            secondLoginBtn.classList.add('hidden');
        } else {
            formTitle.textContent = 'Login';
            formDescription.textContent = 'Enter your username and password';
            submitBtn.textContent = 'Login';
            toggleText.innerHTML = "Don't have an account? <a href='#' id='toggle-form'>Sign up</a>";
            emailGroup.classList.add('hidden');
            addressGroup.classList.add('hidden');
            phoneGroup.classList.add('hidden');

            // Hide the original button in login mode and show the second login button
            submitBtn.classList.add('hidden');
            secondLoginBtn.classList.remove('hidden');
        }

        // Toggle between sign-up and login mode
        const toggleLink = document.getElementById('toggle-form');
        if (toggleLink) {
            toggleLink.addEventListener('click', (e) => {
                e.preventDefault();
                isSignUpMode = !isSignUpMode;
                updateForm();
            });
        }
    };

    updateForm(); // Initialize form state

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email format validation
        return emailRegex.test(email);
    };

    const validatePhoneNumber = (phone) => {
        const phoneRegex = /^\d{11}$/; // Phone number should be exactly 11 digits
        return phoneRegex.test(phone);
    };

    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/; // Password must have at least one special character and be at least 8 chars long
        return passwordRegex.test(password);
    };

    const handleFormSubmission = async (event) => {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const email = isSignUpMode ? document.getElementById('email').value : null;
        const address = isSignUpMode ? document.getElementById('address').value : null;
        const phone = isSignUpMode ? document.getElementById('phone').value : null;

        if (!username || !password) {
            errorMessage.textContent = 'Please fill in both fields.';
            errorMessage.classList.remove('hidden');
            return;
        }

        if (isSignUpMode) {
            if (!email || !validateEmail(email)) {
                errorMessage.textContent = 'Please enter a valid email.';
                errorMessage.classList.remove('hidden');
                return;
            }

            if (!address) {
                errorMessage.textContent = 'Please enter your address.';
                errorMessage.classList.remove('hidden');
                return;
            }

            if (!phone || !validatePhoneNumber(phone)) {
                errorMessage.textContent = 'Please enter a valid phone number (11 digits).';
                errorMessage.classList.remove('hidden');
                return;
            }

            if (!validatePassword(password)) {
                errorMessage.textContent = 'Password must be at least 8 characters long and contain at least one special character.';
                errorMessage.classList.remove('hidden');
                return;
            }
        }

        const endpoint = isSignUpMode ? '/signup' : '/login';
        const payload = {
            username,
            password,
            ...(isSignUpMode && { email, address, phone })
        };

        try {
            const response = await fetch(`http://localhost:3000${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await response.json();
            if (response.ok) {
                alert(result.message);

                // Store user information in local storage upon successful signup/login
                localStorage.setItem('username', username);
                localStorage.setItem('password', password); // You might want to hash this instead

                if (isSignUpMode) {
                    isSignUpMode = false;
                    updateForm();
                }
                window.location.href = '/E-Commerce/Kia.Co.E-Commerce.html';
            } else {
                errorMessage.textContent = result.message;
                errorMessage.classList.remove('hidden');
            }
        } catch (error) {
            errorMessage.textContent = 'Server error. Please try again later.';
            errorMessage.classList.remove('hidden');
        }
    };

    // Event listeners for form submission
    loginForm.addEventListener('submit', handleFormSubmission); // Original login button
    secondLoginBtn.addEventListener('click', (event) => {
        event.preventDefault();
        handleFormSubmission(event); // Reuse the same form submission logic
    });
});
