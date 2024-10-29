const express = require('express');
const cors = require('cors');
const mysql = require('mysql2'); // Use mysql2 for better compatibility
const bcrypt = require('bcrypt'); // To hash passwords
const app = express();
const port = 3000;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // To parse JSON bodies

// MySQL connection setup
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root', 
    password: 'cyatine14', 
    database: 'user_auth' 
});

// Connect to MySQL
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database.');
});

// Sample login route
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Example of a simple query to check credentials
    connection.query('SELECT * FROM users WHERE username = ?', [username], (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
            return res.status(500).json({ message: 'Server error. Please try again later.' });
        }

        if (results.length > 0) {
            const user = results[0];

            // Compare hashed password
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) {
                    console.error('Error comparing passwords:', err);
                    return res.status(500).json({ message: 'Server error. Please try again later.' });
                }

                if (isMatch) {
                    return res.status(200).json({ message: 'Login successful!' });
                } else {
                    return res.status(401).json({ message: 'Invalid credentials.' });
                }
            });
        } else {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }
    });
});

// Sign-up route
app.post('/signup', (req, res) => {
    const { username, password } = req.body;

    // Check if username is already taken
    connection.query('SELECT * FROM users WHERE username = ?', [username], (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
            return res.status(500).json({ message: 'Server error. Please try again later.' });
        }

        if (results.length > 0) {
            return res.status(409).json({ message: 'Username has already been taken. Please choose another one.' });
        }

        // Hash the password before storing it
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                console.error('Error hashing password:', err);
                return res.status(500).json({ message: 'Server error. Please try again later.' });
            }

            // Insert the new user into the database
            connection.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], (error, results) => {
                if (error) {
                    console.error('Error executing query:', error);
                    return res.status(500).json({ message: 'Server error. Please try again later.' });
                }

                return res.status(201).json({ message: 'User registered successfully!' });
            });
        });
    });
});

// Username availability check route
app.post('/check-username', (req, res) => {
    const { username } = req.body;

    connection.query('SELECT * FROM users WHERE username = ?', [username], (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
            return res.status(500).json({ message: 'Server error. Please try again later.' });
        }

        // Check if the username is available
        const isAvailable = results.length === 0; // If no results, the username is available

        return res.status(200).json({ available: isAvailable });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
