const express = require('express');

const productController = require('../controllers/product');
const isAuth = require('../middleware/isAuth');
const noAuth = require('../middleware/noAuth');

const router = express.Router();

router.post('/createProduct', isAuth, productController.createProduct);

router.get('/home', noAuth, productController.home);

router.get('/viewProd/:prodId', noAuth, productController.viewOneProd);

router.get('/category/:category', noAuth, productController.categoryWise);

router.post('/addToCart', isAuth, productController.addToCart);

router.post('/removeFromCart', isAuth, productController.removeFromCart);

router.get('/viewCart', isAuth, productController.viewCart);

router.post('/addAndRemFav', isAuth, productController.addAndRemFav);

router.get('/viewWishlist', isAuth, productController.viewWishlist);

module.exports = router;