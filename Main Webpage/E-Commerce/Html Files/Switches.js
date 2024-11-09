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
    // Ensure quantity is always an integer and limit to max of 20
    quantity = Math.min(parseInt(quantity) || 1, 20);

    // Clean the price by removing any non-numeric characters (including ₱) only for backend
    const cleanedPrice = parseFloat(productPrice.replace(/[^0-9.-]+/g, ''));

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
            price: productPrice, // Store the price with ₱ sign for display
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
    console.log('Cart updated:', cartItems);  // Debugging line

    // Send the updated cart data to the backend
    const username = localStorage.getItem('username'); // Assume username is stored in localStorage
    if (username) {
        fetch('/add-to-cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                productName: productName,
                quantity: quantity,
                price: cleanedPrice, // Send the cleaned price (without ₱ sign) to the backend
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
    const switches = [
        { id: 'akkoV3RedSwitch', name: "Akko V3 Pro CB (45pcs)", price: "₱620.00", quantityId: 'akkoV3ProCreamBlackSwitchQty' },
        { id: 'akkoV3BlueSwitch', name: "Akko V3 Piano Pro (45pcs)", price: "₱630.00", quantityId: 'akkoV3PianoProSwitchQty' },
        { id: 'durockPomLinearSwitch', name: "Durock POM (10pcs)", price: "₱400.00", quantityId: 'durockPomLinearSwitchQty' },
        { id: 'kttSeaSaltLemonSwitch', name: "KTT Sea Salt Lemon (10pcs)", price: "₱140.00", quantityId: 'kttSeaSaltLemonSwitchQty' },
        { id: 'gateronProYellowSwitch', name: "Gateron Pro Yellow (10pcs)", price: "₱140.00", quantityId: 'gateronProYellowSwitchQty' }
    ];

    switches.forEach(switchItem => {
        const addToCartButton = document.getElementById(`${switchItem.id}AddToCart`);
        console.log('addToCartButton:', addToCartButton); // Debugging line
        if (addToCartButton) {
            addToCartButton.addEventListener('click', function() {
                const quantity = document.getElementById(switchItem.quantityId).value;
                console.log(`Adding ${switchItem.name} with quantity ${quantity}`); // Debugging line
                addToCart(switchItem.name, switchItem.price, quantity);
            });
        }
    });
});

// Quantity adjustment functions
function increaseQuantity(id) {
    const qty = document.getElementById(id);
    if (parseInt(qty.value) < 20) { // Limit the maximum quantity to 20
        qty.value = parseInt(qty.value) + 1;
    }
}

function decreaseQuantity(id) {
    const qty = document.getElementById(id);
    if (parseInt(qty.value) > 1) qty.value = parseInt(qty.value) - 1;
}
