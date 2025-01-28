const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const productsFile = path.join(__basedir, 'data', 'productos.json');

const readProducts = () => {
    if (!fs.existsSync(productsFile)) return [];
    const data = fs.readFileSync(productsFile, 'utf8');
    return JSON.parse(data);
};

const writeProducts = (products) => {
    fs.writeFileSync(productsFile, JSON.stringify(products, null, 2), 'utf8');
};

router.get('/', (req, res) => {
    const products = readProducts();
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : products.length;
    res.json(products.slice(0, limit));
});

router.get('/:pid', (req, res) => {
    const products = readProducts();
    const product = products.find(p => p.id === req.params.pid);
    if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
});

router.post('/', (req, res) => {
    const { title, description, code, price, stock, category, thumbnails } = req.body;
    if (!title || !description || !code || !price || !stock || !category) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const products = readProducts();
    const newProduct = {
        id: Date.now().toString(),
        title,
        description,
        code,
        price,
        stock,
        category,
        thumbnails: thumbnails || [],
        status: true,
    };

    products.push(newProduct);
    writeProducts(products);
    res.status(201).json(newProduct);
});

router.put('/:pid', (req, res) => {
    const { pid } = req.params;
    const updates = req.body;

    const products = readProducts();
    const productIndex = products.findIndex(p => p.id === pid);
    if (productIndex === -1) {
        return res.status(404).json({ error: 'Product not found' });
    }

    const product = products[productIndex];
    const updatedProduct = { ...product, ...updates };
    delete updatedProduct.id; // Prevent ID update

    products[productIndex] = updatedProduct;
    writeProducts(products);
    res.json(updatedProduct);
});

router.delete('/:pid', (req, res) => {
    const { pid } = req.params;

    const products = readProducts();
    const filteredProducts = products.filter(p => p.id !== pid);

    if (filteredProducts.length === products.length) {
        return res.status(404).json({ error: 'Product not found' });
    }

    writeProducts(filteredProducts);
    res.status(204).send();
});

module.exports = router;
