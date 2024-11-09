document.addEventListener('DOMContentLoaded', function () {
    // Display cart items from localStorage
    function displayCartItems() {
        const cartItemsContainer = document.getElementById("cartItemsContainer");
        cartItemsContainer.innerHTML = "";

        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        console.log('Cart Items:', cartItems);  // Debugging: log cart items to check if they are retrieved correctly

        let totalAmount = 0;

        if (cartItems.length === 0) {
            cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
        } else {
            cartItems.forEach(item => {
                const itemElement = document.createElement("div");
                itemElement.classList.add("cart-item");
                itemElement.innerHTML = ` 
                    <p>${item.name} - ${item.price} (x${item.quantity})</p>
                `;
                cartItemsContainer.appendChild(itemElement);

                totalAmount += parseFloat(item.price.replace('₱', '').replace(',', '')) * item.quantity;
            });

            document.getElementById("totalAmount").textContent = `₱${totalAmount.toFixed(2)}`;
        }
    }

    // Function to process the order and send data to the server
    function processOrder(paymentMethod) {
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        let totalAmount = document.getElementById("totalAmount").textContent.replace('₱', '').replace(',', '');
        const username = localStorage.getItem('username');
        totalAmount = parseFloat(totalAmount).toFixed(2);

        const orderData = {
            username: username,
            orderDate: new Date().toISOString(),
            totalAmount: totalAmount,
            cartItems: cartItems.map(item => ({
                productName: item.name,
                quantity: item.quantity,
                price: parseFloat(item.price.replace('₱', '').replace(',', ''))
            })),
            paymentMethod: paymentMethod
        };

        fetch('/process-order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success && data.message === 'Order placed successfully.') {
                alert(`Order placed successfully!\n\nOrder Summary:\nUsername: ${username}\nTotal Amount: ₱${totalAmount}`);

                // Generate receipt after successful order placement
                generateReceiptFile(orderData);

                // Reset cart and redirect to main webpage
                localStorage.removeItem('cartItems');
                window.location.href = "index.html"; // Redirect to main webpage (change the URL as needed)
            } else {
                alert(data.message || "Please try again.");
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert("An error occurred while processing your order. Please try again.");
        });
    }

    // Generate a downloadable receipt
    function generateReceiptFile(orderData) {
        let receiptContent = `Receipt for Order\n\nUsername: ${orderData.username}\nOrder Date: ${new Date(orderData.orderDate).toLocaleString()}\nTotal Amount: ₱${orderData.totalAmount}\n\nItems:\n`;

        orderData.cartItems.forEach(item => {
            receiptContent += `- ${item.productName} (x${item.quantity}) - ₱${(item.price * item.quantity).toFixed(2)}\n`;
        });

        receiptContent += `\nPayment Method: ${orderData.paymentMethod}\n`;

        // Log receipt content for debugging
        console.log('Generated Receipt Content:', receiptContent);

        // Create a Blob from the receipt content
        const blob = new Blob([receiptContent], { type: 'text/plain' });

        // Create a URL for the Blob
        const url = URL.createObjectURL(blob);

        // Create a temporary download link element
        const a = document.createElement('a');
        a.href = url;
        a.download = `receipt_${Date.now()}.txt`; // Filename with timestamp

        // Trigger the download after a short delay to ensure everything is ready
        setTimeout(() => {
            a.click(); // Trigger the download
            URL.revokeObjectURL(url); // Clean up the URL object
            console.log('Download triggered for receipt.');
        }, 100);
    }

    // Toggle the dropdown visibility
    window.toggleDropdown = function () {
        const dropdown = document.getElementById("paymentMethodDropdown");
        dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
    }

    // Select a payment method and update the display
    window.selectPaymentMethod = function (method) {
        document.getElementById("selectedPaymentMethod").textContent = method;
        document.getElementById("paymentMethodDropdown").style.display = "none";
    }

    // Event listener for checkout button
    document.getElementById("checkoutButton").addEventListener("click", function () {
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        let totalAmount = document.getElementById("totalAmount").textContent.replace('₱', '').replace(',', '');
        const username = localStorage.getItem('username');

        if (!username) {
            alert("Please log in first.");
            return;
        }

        const paymentMethod = document.getElementById("selectedPaymentMethod").textContent;

        if (cartItems.length === 0) {
            alert("Your cart is empty. Please add items to proceed.");
            return;
        }

        // Check if a valid payment method is selected
        if (paymentMethod === "Cash on Delivery" || paymentMethod === "Credit Card" || paymentMethod === "GCash") {
            processOrder(paymentMethod); // Process order for valid payment methods
        } else {
            alert("Please select a valid payment method.");
        }
    });

    // Close the dropdown when clicking outside of it
    window.addEventListener('click', function (event) {
        const dropdown = document.getElementById("paymentMethodDropdown");
        if (!event.target.closest('#selectedPaymentMethod') && !event.target.closest('.payment-method-dropdown')) {
            dropdown.style.display = "none";
        }
    });

    // Event listener for the cancel order button
    document.getElementById("cancelOrderButton").addEventListener("click", function () {
        // Reset cart and redirect to the main webpage
        localStorage.removeItem('cartItems');
        window.location.href = "/E-Commerce/Kia.Co.E-Commerce.html"; // Redirect to main webpage (change the URL as needed)
    });

    // Initialize the page by displaying cart items
    displayCartItems();
});
