const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const cartsFile = path.join(__basedir, 'data', 'carrito.json');

// Helper function to read carts from file
const readCarts = () => {
    if (!fs.existsSync(cartsFile)) return [];
    const data = fs.readFileSync(cartsFile, 'utf8');
    return JSON.parse(data);
};

// Helper function to write carts to file
const writeCarts = (carts) => {
    fs.writeFileSync(cartsFile, JSON.stringify(carts, null, 2), 'utf8');
};

// POST /api/carts - Create a new cart
router.post('/', (req, res) => {
    const carts = readCarts();
    const newCart = {
        id: Date.now().toString(),
        products: []
    };

    carts.push(newCart);
    writeCarts(carts);
    res.status(201).json(newCart);
});

// GET /api/carts/:cid - Get a cart by ID
router.get('/:cid', (req, res) => {
    const carts = readCarts();
    const cart = carts.find(c => c.id === req.params.cid);
    if (!cart) {
        return res.status(404).json({ error: 'Cart not found' });
    }
    res.json(cart);
});

// POST /api/carts/:cid/product/:pid - Add product to a cart
router.post('/:cid/product/:pid', (req, res) => {
    const { cid, pid } = req.params;
    const carts = readCarts();
    const cartIndex = carts.findIndex(c => c.id === cid);

    if (cartIndex === -1) {
        return res.status(404).json({ error: 'Cart not found' });
    }

    const cart = carts[cartIndex];
    const productIndex = cart.products.findIndex(p => p.product === pid);

    if (productIndex !== -1) {
        // Increment quantity if product already exists in cart
        cart.products[productIndex].quantity += 1;
    } else {
        // Add new product to cart
        cart.products.push({
            product: pid,
            quantity: 1
        });
    }

    carts[cartIndex] = cart;
    writeCarts(carts);
    res.status(200).json(cart);
});

module.exports = router;
