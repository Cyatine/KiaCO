document.addEventListener('DOMContentLoaded', function () {
    // --- Cart Functionality ---
    
    // Function to update the tooltip based on the cart count (unique items)
    function updateCartTooltip() {
        const cartCounter = document.getElementById("cartCounter").textContent;
        const cartIcon = document.getElementById("cartIcon");
        cartIcon.title = `Items in cart: ${cartCounter}`; // Set tooltip with the cart count
    }

    // Function to update the cart count display (total unique items)
    function updateCartCountDisplay() {
        const cartCountElement = document.getElementById("cartCounter");
        if (cartCountElement) {
            const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
            const uniqueItemCount = cartItems.length; // Count unique items
            cartCountElement.textContent = uniqueItemCount; // Update the displayed count
            updateCartTooltip(); // Update tooltip as well
        } else {
            console.error('Cart count element not found on the main page!');
        }
    }

    // Function to update the cart count and localStorage
    function updateCartCount() {
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        const uniqueItemCount = cartItems.length; // Count unique items
        localStorage.setItem('cartCount', uniqueItemCount); // Store the unique item count in localStorage
        updateCartCountDisplay(); // Update the display immediately
    }

    // Function to display cart items in the dropdown with quantities
    function displayCartItems() {
        const cartItemsContainer = document.getElementById("cartItemsContainer");
        cartItemsContainer.innerHTML = ""; // Clear previous items

        // Retrieve cart items from localStorage
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

        if (cartItems.length === 0) {
            cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
        } else {
            cartItems.forEach(item => {
                const itemElement = document.createElement("div");
                // Display product name, price, and quantity (next to price)
                itemElement.textContent = `${item.name} - ${item.price} (x${item.quantity})`; 
                cartItemsContainer.appendChild(itemElement);
            });
        }
    }

    // Toggle cart dropdown and display items
    function toggleCart() {
        const cartDropdown = document.getElementById("cartDropdown");
        cartDropdown.style.display = cartDropdown.style.display === "block" ? "none" : "block";

        if (cartDropdown.style.display === "block") {
            displayCartItems(); // Show items when dropdown is opened
        }
    }

    // --- Profile Icon Functionality ---
    const username = localStorage.getItem('username');
    const profileInitial = document.getElementById('profileInitial');
    profileInitial.textContent = username ? username.charAt(0).toUpperCase() : 'U'; // Default initial

    // Toggle dropdown functionality for profile icon
    const profileIcon = document.getElementById('profileIcon');
    const profileDropdown = document.getElementById('profileDropdown'); // Ensure this element exists

    profileIcon.addEventListener('click', () => {
        profileDropdown.classList.toggle('active'); // Toggle the dropdown visibility
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", function (event) {
        if (!profileIcon.contains(event.target) && !profileDropdown.contains(event.target)) {
            profileDropdown.classList.remove('active'); // Hide the dropdown if clicked outside
        }
    });

    // Logout function
    function logout() {
        localStorage.removeItem('username');
        window.location.href = '/Username and Login Codes/Username.Html';
    }

    // Login function to save the username and redirect
    function loginUser() {
        const usernameInput = document.getElementById('username').value;
        if (usernameInput) {
            localStorage.setItem('username', usernameInput);
            window.location.href = '/Username and Login Codes/Username.Html';
        } else {
            alert('Please enter a valid username');
        }
    }

    // --- Search Functionality ---
    const navSearch = document.getElementById("nav-search");
    navSearch.addEventListener("click", (e) => {
        navSearch.classList.toggle("open");
    });

    // --- Menu Button Functionality ---
    const menuBtn = document.getElementById("menu-btn");
    const navLinks = document.getElementById("nav-links");
    const menuBtnIcon = menuBtn.querySelector("i");

    menuBtn.addEventListener("click", (e) => {
        navLinks.classList.toggle("open");
        const isOpen = navLinks.classList.contains("open");
        menuBtnIcon.setAttribute("class", isOpen ? "ri-close-line" : "ri-menu-line");
    });

    // Close menu on link click
    navLinks.addEventListener("click", () => {
        navLinks.classList.remove("open");
        menuBtnIcon.setAttribute("class", "ri-menu-line");
    });

    // --- Swiper Initialization ---
    const swiper = new Swiper(".swiper", {
        loop: true,
    });

    // --- Product Card Redirect Functionality ---
    const productCards = document.querySelectorAll('.product__card');

    productCards.forEach((card, index) => {
        card.addEventListener('click', function () {
            const productLinks = [
                'keycaps.html',
                'keyboard60.html',
                'keyboard100.html',
                'hand-table-matt.html',
                'keyboard-modding.html',
                'repairs.html'
            ];
            const redirectUrl = productLinks[index];
            if (redirectUrl) {
                window.location.href = redirectUrl; // Redirect to the corresponding product page
            } else {
                console.log("No valid product card found.");
            }
        });
    });

    // --- Clear Cart Functionality ---
    function clearCart() {
        // Clear cart items from localStorage
        localStorage.removeItem('cartItems'); // Remove the cart items array
        localStorage.setItem('cartCount', 0); // Reset cart count to 0
        updateCartCountDisplay(); // Update the displayed cart count
        displayCartItems(); // Update the cart dropdown display to show it's empty
    }

    // Event listener for clearing the cart
    const clearCartButton = document.getElementById('clearCartButton');
    if (clearCartButton) {
        clearCartButton.addEventListener('click', clearCart); // Attach the clearCart function to the button click
    } else {
        console.error("Element with ID 'clearCartButton' not found.");
    }

    // Load cart count display when the page loads
    updateCartCountDisplay(); // Load initial cart count display

    // --- Cart Dropdown Toggle ---
    const cartIcon = document.getElementById("cartIcon");
    const cartDropdown = document.getElementById("cartDropdown");

    // Toggle cart dropdown and display items on cart icon click
    cartIcon.addEventListener("click", () => {
        cartDropdown.style.display = cartDropdown.style.display === "block" ? "none" : "block";
        if (cartDropdown.style.display === "block") {
            displayCartItems(); // Show items when dropdown is opened
        }
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", function (event) {
        if (!cartIcon.contains(event.target) && !cartDropdown.contains(event.target)) {
            cartDropdown.style.display = "none"; // Hide the dropdown if clicked outside
        }
    });

    // Event listener for login button
    const secondLoginBtn = document.getElementById('second-login-btn');
    if (secondLoginBtn) {
        secondLoginBtn.addEventListener('click', loginUser);
    } else {
        console.error("Element with ID 'second-login-btn' not found.");
    }
});

// Function to calculate and update the total price
function updateTotalPrice() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    let totalPrice = 0;

    // Sum up the total price of all items in the cart
    cartItems.forEach(item => {
        totalPrice += item.price * item.quantity;
    });

    // Update the total price in the UI
    const totalPriceElement = document.getElementById('totalPrice');
    if (totalPriceElement) {
        totalPriceElement.textContent = totalPrice.toFixed(2); // Format to 2 decimal places
    }

    // Display the total price bar if there are items in the cart
    const totalPriceBar = document.getElementById('totalPriceBar');
    if (totalPriceBar) {
        totalPriceBar.style.display = cartItems.length > 0 ? 'block' : 'none';
    }
}
