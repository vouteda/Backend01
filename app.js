const express = require('express');
const app = express();
const path = require('path');

// Middlewares
global.__basedir = __dirname; // Define base directory
app.use(express.json()); // For parsing JSON data
app.use(express.urlencoded({ extended: true })); // For parsing URL-encoded data

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Routers
const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');

// Routes
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Default route
app.get('/', (req, res) => {
    res.send('Welcome to the e-commerce API!');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Server setup
const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
