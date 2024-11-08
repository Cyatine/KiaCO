import express from 'express';
import cors from 'cors';
import mysql from 'mysql2';
import bcrypt from 'bcrypt';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from both "Main Webpage" and "Username and Login Codes" folders
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
                    // Successful login
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

// Sign-up route
app.post('/signup', (req, res) => {
    const { username, password, email, address, phone } = req.body;

    // Check if username is already taken
    connection.query('SELECT * FROM customer WHERE username = ?', [username], (error, results) => {
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
            connection.query(
                'INSERT INTO customer (username, password, email, address, phone) VALUES (?, ?, ?, ?, ?)', 
                [username, hashedPassword, email, address, phone], 
                (error, results) => {
                    if (error) {
                        console.error('Error executing query:', error);
                        return res.status(500).json({ message: 'Server error. Please try again later.' });
                    }

                    return res.status(201).json({ message: 'User registered successfully!' });
                }
            );
        });
    });
});

// Username availability check route
app.post('/check-username', (req, res) => {
    const { username } = req.body;

    connection.query('SELECT * FROM customer WHERE username = ?', [username], (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
            return res.status(500).json({ message: 'Server error. Please try again later.' });
        }

        const isAvailable = results.length === 0;
        return res.status(200).json({ available: isAvailable });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
