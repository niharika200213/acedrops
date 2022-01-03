const express = require('express');

const productController = require('../controllers/product');
const isAuth = require('../middleware/isAuth');

const router = express.Router();

router.post('/createProduct', isAuth, productController.createProduct);

router.get('/home', productController.home);

router.get('/viewProd/:prodId', productController.viewOneProd);

router.get('/category/:category', productController.categoryWise);

router.post('/addToCart', isAuth, productController.addToCart);

router.post('/removeFromCart', isAuth, productController.removeFromCart);

module.exports = router;