// Function to update the cart count display
function updateCartCount() {
    const cartCountElement = document.getElementById("cartCounter");
    if (cartCountElement) {
        const cartCount = localStorage.getItem('cartCount') || 0;
        cartCountElement.textContent = cartCount; // Update the displayed count
    }
}

// Function to add item to cart
function addToCart(productName, productPrice, quantity) {
    // Ensure quantity is an integer and limit it to a max of 20
    quantity = Math.min(parseInt(quantity) || 1, 20);

    // Retrieve existing cart items from localStorage
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

    // Check if the product is already in the cart
    const existingItemIndex = cartItems.findIndex(item => item.name === productName);

    if (existingItemIndex > -1) {
        // If item exists, update its quantity but do not exceed 20
        cartItems[existingItemIndex].quantity = Math.min(cartItems[existingItemIndex].quantity + quantity, 20);
    } else {
        // If item doesn't exist, create a new item and add to cart
        const newItem = {
            name: productName,
            price: productPrice,
            quantity: quantity
        };
        cartItems.push(newItem);
    }

    // Store updated cart items back to localStorage
    localStorage.setItem('cartItems', JSON.stringify(cartItems));

    // Update cart count in localStorage
    localStorage.setItem('cartCount', cartItems.length);

    // Immediately update the cart count display
    updateCartCount();

    // Optional: Show a message to the user
    alert(`${productName} has been added to your cart!`);

    // Send the updated cart data to the backend
    const username = localStorage.getItem('username'); // Assume username is stored in localStorage
    if (username) {
        // Loop through each item in the cart and send its data
        cartItems.forEach(item => {
            fetch('/add-to-cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    productName: item.name,
                    quantity: item.quantity,
                    price: parseFloat(item.price.replace(/[^0-9.-]+/g, '')) // Clean price for backend (remove ₱ sign)
                }),
            })
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    console.log(data.message);
                }
            })
            .catch((error) => {
                console.error('Error adding to cart:', error);
            });
        });
    }
}

// Event listener for Add to Cart buttons
document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM fully loaded and parsed"); // Debugging line
    updateCartCount(); // Update the cart count on load

    // Listen for changes to localStorage across all open tabs/pages
    window.addEventListener('storage', (event) => {
        if (event.key === 'cartCount') {
            updateCartCount(); // Update the cart count if it changes in another tab/page
        }
    });

    // Attach event listeners for each Add to Cart button
    const products = [
        { id: 'kaiju', name: "GMK Kaiju Keycaps", price: "₱2500.00", quantityId: 'kaijuQty' },
        { id: 'soyMilk', name: "GMK Soy Milk Keycaps", price: "₱1350.00", quantityId: 'soyMilkQty' },
        { id: 'remen', name: "GMK Remen Keycaps", price: "₱1750.00", quantityId: 'remenQty' },
        { id: 'macaw', name: "Akko Macaw Keycaps", price: "₱2600.00", quantityId: 'macawQty' },
        { id: 'honor', name: "GMK Honor Keycaps", price: "₱2900.00", quantityId: 'honorQty' }
    ];

    products.forEach(product => {
        const addToCartButton = document.getElementById(`${product.id}AddToCart`);
        if (addToCartButton) {
            addToCartButton.addEventListener('click', function() {
                const quantity = document.getElementById(product.quantityId).value;
                addToCart(product.name, product.price, quantity);
            });
        }
    });
});

// Quantity adjustment functions
function increaseQuantity(id) {
    const qty = document.getElementById(id);
    if (parseInt(qty.value) < 20) { // Set max quantity to 20
        qty.value = parseInt(qty.value) + 1;
    }
}

function decreaseQuantity(id) {
    const qty = document.getElementById(id);
    if (parseInt(qty.value) > 1) qty.value = parseInt(qty.value) - 1;
}
