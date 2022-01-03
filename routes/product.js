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

router.get('/viewCart', isAuth, productController.viewCart);

router.post('/addAndRemFav', isAuth, productController.addAndRemFav);

router.get('/viewWishlist', isAuth, productController.viewWishlist);

module.exports = router;