document.addEventListener('DOMContentLoaded', function () {
    // Retrieve items from localStorage
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const checkoutContainer = document.getElementById('checkoutItems');

    let totalQuantity = 0;
    let totalPrice = 0;

    // Loop through cart items and display each
    cartItems.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('checkout-item');

        // Ensure the item has an image; use a placeholder if not
        const imageUrl = item.image || 'Images/placeholder.png'; // Replace 'Images/placeholder.png' with the path to your placeholder image

        // Clean the price before displaying (remove ₱ and non-numeric characters)
        const cleanPrice = parseFloat(item.price.replace(/[^\d.-]/g, '')) || 0;
        const quantity = parseInt(item.quantity, 10) || 0;

        totalQuantity += quantity;
        totalPrice += cleanPrice * quantity;

        itemElement.innerHTML = `
            <img src="${imageUrl}" alt="${item.name}" class="product-image">
            <div class="checkout-item-info">
                <p class="item-title">${item.name}</p>
                <p class="item-price">Price: ₱${cleanPrice.toFixed(2)}</p>
                <p class="item-quantity">Quantity: ${quantity}</p>
            </div>
        `;

        checkoutContainer.appendChild(itemElement);
    });

    // Display total quantity and total price
    const totalQuantityElement = document.createElement('p');
    totalQuantityElement.classList.add('total-quantity');
    totalQuantityElement.textContent = `Total Items: ${totalQuantity}`;
    checkoutContainer.appendChild(totalQuantityElement);

    const totalPriceElement = document.createElement('p');
    totalPriceElement.classList.add('total-price');
    totalPriceElement.textContent = `Total Price: ₱${totalPrice.toFixed(2)}`;
    checkoutContainer.appendChild(totalPriceElement);

    // Add a checkout button with functionality
    const checkoutButton = document.createElement('button');
    checkoutButton.classList.add('checkout-btn');
    checkoutButton.textContent = 'Proceed to Checkout';
    checkoutButton.addEventListener('click', () => {
        // Simulate checkout processing
        alert('Processing your checkout...');
        
        // Redirect to another page after processing
        setTimeout(() => {
            window.location.href = 'confirmation.html'; // Replace with your desired URL
        }, 2000); // Delay to simulate processing
    });

    checkoutContainer.appendChild(checkoutButton);
});
