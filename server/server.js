import express from 'express';
import cors from 'cors';
import mysql from 'mysql2';
import bcrypt from 'bcrypt';
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';  // Import express-session

// Get the current directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Session setup
app.use(session({
    secret: 'your-secret-key',  // Use a strong secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }  // In production, set secure: true for HTTPS
}));

// Serve static files
app.use(express.static(path.join(__dirname, '../Main Webpage')));
app.use(express.static(path.join(__dirname, '../Username and Login Codes')));

// MySQL connection setup
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'trapinch12',
    database: 'kiaco'
});

// Connect to MySQL
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database.');
});

// Serve Username.Html at root path
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../Username and Login Codes', 'Username.Html'));
});

// Serve Kia.Co.Ecommerce.html
app.get('/kia-co-ecommerce', (req, res) => {
    res.sendFile(path.join(__dirname, '../E-Commerce', 'Kia.Co.E-commerce.html'));
});

// Login route
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Log the incoming request body for debugging
    console.log('Login attempt:', { username, password });

    // Query the customer table to check credentials
    connection.query('SELECT * FROM customer WHERE username = ?', [username], (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
            return res.status(500).json({ message: 'Server error. Please try again later.' });
        }

        // If the user is found
        if (results.length > 0) {
            const user = results[0];

            // Compare hashed password
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) {
                    console.error('Error comparing passwords:', err);
                    return res.status(500).json({ message: 'Server error. Please try again later.' });
                }

                if (isMatch) {
                    // Successful login, save session data
                    req.session.user = { username, customerID: user.customerID };  // Store user data in session
                    console.log('Login successful for user:', username);
                    return res.status(200).json({ message: 'Login successful!' });
                } else {
                    // Invalid password
                    console.warn('Invalid credentials for user:', username);
                    return res.status(401).json({ message: 'Invalid credentials.' });
                }
            });
        } else {
            // No user found with the given username
            console.warn('Invalid credentials: user not found:', username);
            return res.status(401).json({ message: 'Invalid credentials.' });
        }
    });
});

// Logout route
app.post('/logout', (req, res) => {
    const { cartItems } = req.body;  // Cart items to be saved

    if (req.session.user) {
        const { username } = req.session.user;

        // Save cart items for the user before logging out
        if (cartItems && cartItems.length > 0) {
            // Save the cart items to the database
            cartItems.forEach(item => {
                const insertItemQuery = 'INSERT INTO cart (username, productName, quantity, price) VALUES (?, ?, ?, ?)';
                connection.query(insertItemQuery, [username, item.productName, item.quantity, item.price], (err) => {
                    if (err) {
                        console.error('Error saving cart item:', err);
                    }
                });
            });
        }

        // Destroy session on logout
        req.session.destroy((err) => {
            if (err) {
                console.error('Error destroying session:', err);
                return res.status(500).json({ message: 'Error logging out. Please try again later.' });
            }

            console.log('User logged out:', username);
            return res.status(200).json({ message: 'Logout successful.' });
        });
    } else {
        return res.status(400).json({ message: 'No active session found.' });
    }
});

// Endpoint to add item to cart
app.post('/add-to-cart', (req, res) => {
    const { username, productName, quantity, price } = req.body;

    // Ensure price is a string before applying replace
    const priceString = price.toString();  // Convert price to string if it's not already
    const cleanedPrice = parseFloat(priceString.replace(/[^0-9.-]+/g, ''));

    // Ensure cleanedPrice is a valid number before proceeding
    if (isNaN(cleanedPrice)) {
        return res.status(400).json({ message: 'Invalid price value' });
    }

    // SQL query to insert the product into the cart
    const query = `INSERT INTO cart (username, productName, quantity, price) VALUES (?, ?, ?, ?)`;

    connection.query(query, [username, productName, quantity, cleanedPrice], (err, result) => {
        if (err) {
            console.error('Error adding item to cart:', err);
            return res.status(500).json({ message: 'Error adding item to cart' });
        }
        return res.json({ message: 'Item added to cart successfully!' });
    });
});

// View cart route
app.get('/view-cart', (req, res) => {
    // Ensure the user is logged in (session exists)
    if (!req.session.user) {
        return res.status(401).json({ message: 'You must be logged in to view the cart.' });
    }

    const { username } = req.session.user; // Get the username from the session

    // Retrieve the user's cart items
    const query = 'SELECT * FROM cart WHERE username = ?';
    connection.query(query, [username], (err, results) => {
        if (err) {
            console.error('Error retrieving cart:', err);
            return res.status(500).json({ message: 'Error retrieving cart.' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Cart is empty.' });
        }

        res.status(200).json({ cartItems: results });
    });
});

// Update cart route
app.put('/update-cart', (req, res) => {
    // Ensure the user is logged in (session exists)
    if (!req.session.user) {
        return res.status(401).json({ message: 'You must be logged in to update the cart.' });
    }

    const { productName, quantity, price } = req.body;
    const { username } = req.session.user;

    // Validate input data
    if (!productName || !quantity || !price) {
        return res.status(400).json({ message: "Missing data." });
    }

    // Update the cart item
    const query = 'UPDATE cart SET quantity = ?, price = ? WHERE username = ? AND productName = ?';
    connection.query(query, [quantity, price, username, productName], (err, result) => {
        if (err) {
            console.error('Error updating cart item:', err);
            return res.status(500).json({ message: 'Error updating cart.' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Product not found in cart.' });
        }

        res.status(200).json({ message: 'Cart updated successfully.' });
    });
});

// Remove from cart route
app.delete('/remove-from-cart', (req, res) => {
    // Ensure the user is logged in (session exists)
    if (!req.session.user) {
        return res.status(401).json({ message: 'You must be logged in to remove items from the cart.' });
    }

    const { productName } = req.body;
    const { username } = req.session.user;

    // Validate input data
    if (!productName) {
        return res.status(400).json({ message: "Missing product name." });
    }

    // Delete the item from the cart
    const query = 'DELETE FROM cart WHERE username = ? AND productName = ?';
    connection.query(query, [username, productName], (err, result) => {
        if (err) {
            console.error('Error removing item from cart:', err);
            return res.status(500).json({ message: 'Error removing item from cart.' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Product not found in cart.' });
        }

        res.status(200).json({ message: 'Item removed from cart.' });
    });
});


// Process order route (same as before)
app.post('/process-order', (req, res) => {
    const { username, orderDate, totalAmount, cartItems, paymentMethod } = req.body;

    if (!username || !orderDate || !totalAmount || !cartItems || !paymentMethod) {
        return res.status(400).json({ success: false, message: "Missing data." });
    }

    const formattedOrderDate = new Date(orderDate).toISOString().slice(0, 19).replace('T', ' '); // Format to 'YYYY-MM-DD HH:MM:SS'

    // Query the customerID from the customers table using the username
    const customerQuery = 'SELECT customerID FROM customer WHERE username = ?';
    connection.query(customerQuery, [username], (err, results) => {
        if (err) {
            console.error('Error finding customer:', err);
            return res.status(500).json({ success: false, message: 'Error finding customer.' });
        }

        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'Customer not found.' });
        }

        // Now insert the order with the formatted orderDate
        const orderQuery = 'INSERT INTO orders (username, OrderDate, TotalAmount) VALUES (?, ?, ?)';
        connection.query(orderQuery, [username, formattedOrderDate, totalAmount], (err, result) => {
            if (err) {
                console.error('Error inserting order:', err);
                return res.status(500).json({ success: false, message: 'Error inserting order.' });
            }

            const orderID = result.insertId;
            let itemsInserted = 0;
            let totalItems = cartItems.length;

            // Insert order items into the orderitem table
            cartItems.forEach(item => {
                const insertItemQuery = 'INSERT INTO orderitem (OrderID, Quantity, Price, ProductName) VALUES (?, ?, ?, ?)';
                connection.query(insertItemQuery, [orderID, item.quantity, item.price, item.productName], (err) => {
                    if (err) {
                        console.error(`Error inserting item ${item.productName}:`, err);
                        return res.status(500).json({ success: false, message: 'Error inserting order items.' });
                    }

                    itemsInserted++;

                    if (itemsInserted === totalItems) {
                        const paymentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');

                        const paymentQuery = `
                            INSERT INTO payment (OrderID, Amount, PaymentMethod, PaymentStatus, PaymentDate)
                            VALUES (?, ?, ?, ?, ?)
                        `;

                        connection.query(paymentQuery, [orderID, totalAmount, paymentMethod, 'Pending', paymentDate], (err, result) => {
                            if (err) {
                                console.error('Error inserting payment:', err);
                                return res.status(500).json({ success: false, message: 'Error processing payment.' });
                            }

                            res.status(200).json({ success: true, message: 'Order and payment processed successfully.' });
                        });
                    }
                });
            });

            if (totalItems === 0) {
                const paymentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');

                const paymentQuery = `
                    INSERT INTO payment (OrderID, Amount, PaymentMethod, PaymentStatus, PaymentDate)
                    VALUES (?, ?, ?, ?, ?)
                `;

                connection.query(paymentQuery, [orderID, totalAmount, paymentMethod, 'Pending', paymentDate], (err, result) => {
                    if (err) {
                        console.error('Error inserting payment:', err);
                        return res.status(500).json({ success: false, message: 'Error processing payment.' });
                    }

                    res.status(200).json({ success: true, message: 'Order and payment processed successfully.' });
                });
            }
        });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
