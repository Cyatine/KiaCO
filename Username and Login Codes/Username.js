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

    // Function to update the form based on the mode
    const updateForm = () => {
        // Clear the input fields for privacy
        usernameInput.value = '';
        passwordInput.value = '';

        if (isSignUpMode) {
            formTitle.textContent = 'Sign Up';
            formDescription.textContent = 'Create a new account';
            submitBtn.textContent = 'Sign Up';
            toggleText.innerHTML = "Already have an account? <a href='#' id='login-link'>Login</a>";
            
            // Add event listener to the login link if it exists
            const loginLink = document.getElementById('login-link');
            if (loginLink) {
                loginLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    isSignUpMode = false; // Switch to login mode
                    updateForm(); // Update the form
                });
            }
        } else {
            formTitle.textContent = 'Login';
            formDescription.textContent = 'Enter your username and password';
            submitBtn.textContent = 'Login';
            toggleText.innerHTML = "Don't have an account? <a href='#' id='sign-up-link'>Sign up</a>";
            
            // Add event listener to the sign-up link if it exists
            const signUpLink = document.getElementById('sign-up-link');
            if (signUpLink) {
                signUpLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    isSignUpMode = true; // Switch to sign-up mode
                    updateForm(); // Update the form
                });
            }
        }
    };

    // Initialize the form in login mode
    updateForm();

    // Handle form submission (Login/Sign-up)
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = usernameInput.value;
        const password = passwordInput.value;

        // Determine the endpoint based on the mode (Sign Up or Login)
        const endpoint = isSignUpMode ? '/signup' : '/login';

        try {
            // Send the POST request to the appropriate endpoint
            const response = await fetch(`http://localhost:3000${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const result = await response.json();

            if (response.ok) {
                alert(result.message); // Optionally display a message
                if (isSignUpMode) {
                    // Switch to login mode after successful sign-up
                    isSignUpMode = false;
                    updateForm();
                }
                // Redirect to another webpage after successful login
                window.location.href = 'Kia.Co.E-Commerce.html'; // Change this to the desired URL
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Server error. Please try again later.');
        }
    });
});
