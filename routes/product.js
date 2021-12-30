const express = require('express');

const productController = require('../controllers/product');
const isAuth = require('../middleware/isAuth');

const router = express.Router();

router.post('/createProduct', isAuth, productController.createProduct);

router.get('/getAllProds', productController.getAllProducts);

module.exports = router;