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
    console.log('Cart updated:', cartItems);  // Debugging line
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
    const tklkeyboards = [
        { id: 'keychronQ3BWRAddToCart', name: "Keychron Q3 BWR", price: "₱8600.00", quantityId: 'keychronQ3BWRQty' },
        { id: 'keychronQ3WGAddToCart', name: "Keychron Q3 WG", price: "₱8500.00", quantityId: 'keychronQ3WGQty' },
        { id: 'gmk87AddToCart', name: "GMK87", price: "₱2350.00", quantityId: 'gmk87Qty' },
        { id: 'weikavStars80AddToCart', name: "Weikav Stars80", price: "₱5500.00", quantityId: 'weikavStars80Qty' },
        { id: 'varmiloVAAddToCart', name: "Varmilo VA", price: "₱7800.00", quantityId: 'varmiloVAQty' }
    ];

    tklkeyboards.forEach(product => {
        const addToCartButton = document.getElementById(product.id);
        console.log('addToCartButton:', addToCartButton); // Debugging line
        if (addToCartButton) {
            addToCartButton.addEventListener('click', function() {
                const quantity = document.getElementById(product.quantityId).value;
                console.log(`Adding ${product.name} with quantity ${quantity}`); // Debugging line
                addToCart(product.name, product.price, quantity);
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
