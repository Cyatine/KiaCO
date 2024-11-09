document.addEventListener('DOMContentLoaded', function () {
    // --- Cart Functionality ---
    
    // Function to display cart items in the checkout page
    function displayCartItemsInCheckout() {
        const cartItemsContainer = document.getElementById("checkoutCartItemsContainer");
        cartItemsContainer.innerHTML = ""; // Clear previous items

        // Retrieve cart items from localStorage
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

        if (cartItems.length === 0) {
            cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
        } else {
            cartItems.forEach(item => {
                const itemElement = document.createElement("div");
                itemElement.classList.add("cart-item");

                // Create a container for each cart item with an image, name, price, and quantity
                itemElement.innerHTML = `
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                    <div class="cart-item-details">
                        <p class="cart-item-name">${item.name}</p>
                        <p class="cart-item-price">${item.price}</p>
                        <p class="cart-item-quantity">Quantity: ${item.quantity}</p>
                    </div>
                `;
                cartItemsContainer.appendChild(itemElement);
            });
        }
    }

    // --- Cart Count & Tooltip ---
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

    // Function to update cart count display
    function updateCartCount() {
        const cartCountElement = document.getElementById("cartCounter");
        if (cartCountElement) {
            const cartCount = localStorage.getItem('cartCount') || 0;
            cartCountElement.textContent = cartCount; // Update the displayed count
        }
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

    function logout(event) {
        // Prevent the default link action (which would reload or navigate)
        event.preventDefault();
    
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    
        // Check if there are items in the cart
        if (cartItems.length > 0) {
            const userConfirmation = confirm("You have items in your cart. Do you want to save your cart before logging out?");
    
            if (userConfirmation) {
                // If user chooses to save cart
                fetch('http://localhost:3000/logout', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ cartItems: cartItems }),
                })
                .then(response => response.json())
                .then(result => {
                    if (result.message === 'Logout successful.') {
                        alert('Your cart has been saved successfully!');
                    } else {
                        alert('Failed to save cart. Please try again.');
                    }
                    // Clear session and localStorage data
                    localStorage.removeItem('cartItems');
                    localStorage.setItem('cartCount', 0); // Reset cart count to 0
                    window.location.href = '/'; // Redirect to login or homepage
                })
                .catch(error => {
                    console.error('Error saving cart:', error);
                    alert('There was an error saving your cart.');
                });
            } else {
                // If user chooses not to save cart
                fetch('http://localhost:3000/logout', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ cartItems: [] }), // Send empty cart
                })
                .then(response => response.json())
                .then(result => {
                    alert('Logged out successfully!');
                    window.location.href = '/'; // Redirect to login or homepage
                })
                .catch(error => {
                    console.error('Error logging out:', error);
                    alert('Error logging out.');
                });
            }
        } else {
            // No items in the cart, proceed with logout
            fetch('http://localhost:3000/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ cartItems: [] }), // Send empty cart
            })
            .then(response => response.json())
            .then(result => {
                alert('Logged out successfully!');
                window.location.href = '/'; // Redirect to login page
            })
            .catch(error => {
                console.error('Error logging out:', error);
                alert('Error logging out.');
            });
        }
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

    // --- Product Card Redirect Functionality ---
    const productCards = document.querySelectorAll('.product__card');

    productCards.forEach((card, index) => {
        card.addEventListener('click', function () {
            const productLinks = [
                'keycaps.html',
                'Compact Keyboards.html',
                'TKL Keyboards.html',
                'Switches.html',
                'keyboard-modding.html',
                'Modding Essentials.html'
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

    // --- Cart Item Add Functionality ---
    function addToCart(productName, productPrice, quantity, productImage) {
        let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        quantity = parseInt(quantity) || 1;

        const existingItemIndex = cartItems.findIndex(item => item.name === productName);

        if (existingItemIndex > -1) {
            cartItems[existingItemIndex].quantity += quantity;
        } else {
            const newItem = {
                name: productName,
                price: productPrice,
                quantity: quantity,
                image: productImage // Image URL passed when adding to the cart
            };
            cartItems.push(newItem);
        }

        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        localStorage.setItem('cartCount', cartItems.length);
        updateCartCount(); // Update cart count
        alert(`${productName} has been added to your cart!`);
    }

    // Event listener for Add to Cart buttons
    const products = [
        { id: 'akkoMU01AddToCart', name: "Akko MU01 JOL", price: "₱7299.00", quantityId: 'akkoMU01Qty', image: 'Images/Akko Joy of Life.jpg' },
        { id: 'weikavLucky65V2AddToCart', name: "Weikav Lucky65 V2", price: "₱3300.00", quantityId: 'weikavLucky65V2Qty', image: 'Images/Weikav Lucky65 V2.jpg' },
        // Add more products...
    ];

    // Attach event listeners to the add-to-cart buttons
    products.forEach(product => {
        const addToCartButton = document.getElementById(product.id);
        if (addToCartButton) {
            addToCartButton.addEventListener('click', function() {
                const quantity = document.getElementById(product.quantityId).value;
                addToCart(product.name, product.price, quantity, product.image); // Pass image URL here
            });
        }
    });
});
