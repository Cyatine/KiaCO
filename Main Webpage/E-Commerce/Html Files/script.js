// Function to update the cart count display
function updateCartCount() {
    const cartCountElement = document.getElementById("cartCounter"); // Adjust to the correct ID on each page
    if (cartCountElement) {
        const cartCount = localStorage.getItem('cartCount') || 0;
        cartCountElement.textContent = cartCount; // Update the displayed count
    } else {
        console.error('Cart count element not found on this page!');
    }
}

// Load cart items on page load and set up event listeners
document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM fully loaded and parsed"); // Debugging line
    updateCartCount(); // Update the cart count on load

    // Listen for changes to localStorage across all open tabs/pages
    window.addEventListener('storage', (event) => {
        if (event.key === 'cartCount') {
            updateCartCount(); // Update the cart count if it changes in another tab/page
        }
    });

    // Attach event listener for the Add to Cart button if it exists on the current page
    const addToCartButton = document.getElementById('add-to-cart-button');
    if (addToCartButton) {
        addToCartButton.addEventListener('click', function() {
            const item = {
                name: "GMK Kaiju Keycaps",
                price: "₱2500.00"
            };

            // Retrieve existing cart items from localStorage
            let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
            cartItems.push(item); // Add the new item

            // Store updated cart items back to localStorage
            localStorage.setItem('cartItems', JSON.stringify(cartItems));

            // Update cart count in localStorage
            localStorage.setItem('cartCount', cartItems.length);

            // Immediately update the cart count display
            updateCartCount();

            // Optional: Show a message to the user
            alert(`${item.name} has been added to your cart!`);
        });
    } else {
        console.log('Add to Cart button not present on this page.');
    }
});
