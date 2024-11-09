// Function to update the cart count display
function updateCartCount() {
    const cartCountElement = document.getElementById("cartCounter");
    if (cartCountElement) {
        const cartCount = localStorage.getItem('cartCount') || 0;
        cartCountElement.textContent = cartCount; // Update the displayed count
    }
}

// Function to add item to cart and send data to the backend
function addToCart(productName, productPrice, quantity) {
    // Retrieve existing cart items from localStorage
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

    // Ensure quantity is always an integer
    quantity = parseInt(quantity) || 1;

    // Check if the product is already in the cart
    const existingItemIndex = cartItems.findIndex(item => item.name === productName);

    if (existingItemIndex > -1) {
        // If item exists, update its quantity
        cartItems[existingItemIndex].quantity += quantity;
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
    const username = localStorage.getItem('username'); // Assuming the username is stored in localStorage
    if (username) {
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
                    price: parseFloat(item.price.replace(/[^0-9.-]+/g, '')), // Clean price for backend (remove ₱ symbol)
                }),
            })
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    console.log(data.message); // Handle backend response if necessary
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
    updateCartCount(); // Update the cart count on load

    // Listen for changes to localStorage across all open tabs/pages
    window.addEventListener('storage', (event) => {
        if (event.key === 'cartCount') {
            updateCartCount(); // Update the cart count if it changes in another tab/page
        }
    });

    // Attach event listeners for each Add to Cart button
    const services = [
        { id: 'fullKeyboardModAddToCart', name: "Full Keeb Mod", price: "₱250.00", quantity: 1 },
        { id: 'solderingAddToCart', name: "Keeb Solder/Desolder & (Millmax)", price: "₱20.00", quantityId: 'solderingQty' },
        { id: 'cleaningAddToCart', name: "Keeb Cleaning", price: "₱60.00", quantity: 1 },
        { id: 'lubingAddToCart', name: "Switch Lubing", price: "₱6.00", quantityId: 'lubingQty' },
        { id: 'stabilizerModAddToCart', name: "Stab Mod", price: "₱25.00", quantityId: 'stabilizerModQty' }
    ];

    services.forEach(service => {
        const addToCartButton = document.getElementById(service.id);
        if (addToCartButton) {
            addToCartButton.addEventListener('click', function() {
                const quantity = service.quantity || document.getElementById(service.quantityId).value;
                addToCart(service.name, service.price, quantity);
            });
        }
    });
});

// Quantity adjustment functions
function increaseQuantity(id) {
    const qty = document.getElementById(id);
    qty.value = parseInt(qty.value) + 1;
}

function decreaseQuantity(id) {
    const qty = document.getElementById(id);
    if (parseInt(qty.value) > 1) qty.value = parseInt(qty.value) - 1;
}
