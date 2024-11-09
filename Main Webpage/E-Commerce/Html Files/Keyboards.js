// Function to update the cart count display
function updateCartCount() {
    const cartCountElement = document.getElementById("cartCounter");
    if (cartCountElement) {
        const cartCount = localStorage.getItem('cartCount') || 0;
        cartCountElement.textContent = cartCount; // Update the displayed count
    }
}

// Function to add item to cart or increase quantity if item already exists
function addToCart(productName, productPrice, quantity, productImage) {
    // Ensure the quantity does not exceed the max limit
    const maxQuantity = 20;
    quantity = Math.min(parseInt(quantity), maxQuantity);

    // Retrieve existing cart items from localStorage
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

    // Check if the product already exists in the cart
    const existingItemIndex = cartItems.findIndex(item => item.name === productName && item.price === productPrice && item.image === productImage);

    if (existingItemIndex !== -1) {
        // If item exists, increase the quantity but do not exceed max limit
        cartItems[existingItemIndex].quantity = Math.min(cartItems[existingItemIndex].quantity + quantity, maxQuantity);
    } else {
        // If item doesn't exist, create a new item object
        const newItem = {
            name: productName,
            price: productPrice,
            quantity: quantity,
            image: productImage // Store the image URL as well
        };
        // Add the new item to the cart array
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
                    price: parseFloat(item.price.replace(/[^0-9.-]+/g, '')), // Clean price for backend (remove ₱ sign)
                    image: item.image // Send the image URL to the backend
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
        { id: 'akkoMU01AddToCart', name: "Akko MU01 JOL", price: "₱7299.00", quantityId: 'akkoMU01Qty', image: 'Images/Akko Joy of Life.jpg' },
        { id: 'weikavLucky65V2AddToCart', name: "Weikav Lucky65 V2", price: "₱3300.00", quantityId: 'weikavLucky65V2Qty', image: 'path/to/weikavLucky65V2.jpg' },
        { id: 'aulaF75AddToCart', name: "Aula F75", price: "₱3000.00", quantityId: 'aulaF75Qty', image: 'path/to/aulaF75.jpg' },
        { id: 'aulaLEOBOGHi75AddToCart', name: "AULA LEOBOG Hi75", price: "₱2400.00", quantityId: 'aulaLEOBOGHi75Qty', image: 'path/to/aulaLEOBOGHi75.jpg' },
        { id: 'womierSK65AddToCart', name: "WOMIER SK65", price: "₱6000.00", quantityId: 'womierSK65Qty', image: 'path/to/womierSK65.jpg' }
    ];

    products.forEach(product => {
        const addToCartButton = document.getElementById(product.id);
        console.log('addToCartButton:', addToCartButton); // Debugging line
        if (addToCartButton) {
            addToCartButton.addEventListener('click', function() {
                const quantity = document.getElementById(product.quantityId).value;
                console.log(`Adding ${product.name} with quantity ${quantity}`); // Debugging line
                addToCart(product.name, product.price, quantity, product.image);
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
