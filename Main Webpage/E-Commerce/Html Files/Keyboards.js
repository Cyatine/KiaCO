// Function to update the cart count display
function updateCartCount() {
    const cartCountElement = document.getElementById("cartCounter");
    if (cartCountElement) {
        const cartCount = localStorage.getItem('cartCount') || 0;
        cartCountElement.textContent = cartCount; // Update the displayed count
    }
}

// Function to show visual confirmation when an item is added to the cart
function showVisualConfirmation(productName, productImage) {
    const confirmation = document.createElement('div');
    confirmation.classList.add('confirmation-popup');
    confirmation.innerHTML = `
        <img src="${productImage}" alt="${productName}" class="confirmation-image">
        <p>${productName} added to cart!</p>
    `;
    document.body.appendChild(confirmation);

    setTimeout(() => {
        confirmation.remove();
    }, 3000); // Remove the popup after 3 seconds
}

// Function to add item to cart
function addToCart(productName, productPrice, quantity, productImage) {
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
            quantity: quantity,
            image: productImage // Add the image URL to the new item
        };
        cartItems.push(newItem);
    }

    // Store updated cart items back to localStorage
    localStorage.setItem('cartItems', JSON.stringify(cartItems));

    // Update cart count in localStorage
    localStorage.setItem('cartCount', cartItems.length);

    // Immediately update the cart count display
    updateCartCount();

    // Show visual confirmation
    showVisualConfirmation(productName, productImage);

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
    const products = [
        { id: 'akkoMU01AddToCart', name: "Akko MU01 JOL", price: "₱7299.00", quantityId: 'akkoMU01Qty', image: 'Images/Akko Joy of Life.jpg' },
        { id: 'weikavLucky65V2AddToCart', name: "Weikav Lucky65 V2", price: "₱3300.00", quantityId: 'weikavLucky65V2Qty', image: 'Images/Weikav Lucky65 V2.jpg' },
        { id: 'aulaF75AddToCart', name: "Aula F75", price: "₱3000.00", quantityId: 'aulaF75Qty', image: 'Images/AULA F75.jpg' },
        { id: 'aulaLEOBOGHi75AddToCart', name: "AULA LEOBOG Hi75", price: "₱2400.00", quantityId: 'aulaLEOBOGHi75Qty', image: 'Images/AULA LEOBOG Hi75.jpg' },
        { id: 'womierSK65AddToCart', name: "WOMIER SK65", price: "₱6000.00", quantityId: 'womierSK65Qty', image: 'Images/Womier SK65.jpg' }
    ];

    products.forEach(product => {
        const addToCartButton = document.getElementById(product.id);
        if (addToCartButton) {
            addToCartButton.addEventListener('click', function() {
                const quantity = document.getElementById(product.quantityId).value;
                console.log(`Adding ${product.name} with quantity ${quantity}`); // Debugging line
                addToCart(product.name, product.price, quantity, product.image); // Pass image URL here
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
