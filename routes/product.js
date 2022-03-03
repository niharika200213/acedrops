const express = require('express');
const { body } = require('express-validator');

const productController = require('../controllers/product');
const isAuth = require('../middleware/isAuth');
const noAuth = require('../middleware/noAuth');

const router = express.Router();

router.post('/createProduct', [
    body('title').trim().not().isEmpty().withMessage('please enter title'),
    body('description').trim().not().isEmpty().withMessage('please enter description'),
    body('shortDescription').trim().not().isEmpty().withMessage('please enter shortDescription'),
    body('offers').trim().not().isEmpty().withMessage('please enter offers'),
    body('category').trim().not().isEmpty().withMessage('please enter category'),
    body('images').not().isEmpty().withMessage('please enter images')
], isAuth, productController.createProduct);

router.get('/home', noAuth, productController.home);

router.get('/viewProd/:prodId', noAuth, productController.viewOneProd);

router.get('/category/:category', noAuth, productController.categoryWise);

router.post('/addToCart', isAuth, productController.addToCart);

router.post('/removeFromCart', isAuth, productController.removeFromCart);

router.post('/deleteCartProd', isAuth, productController.deleteCartProd);

router.get('/viewCart', isAuth, productController.viewCart);

router.post('/addAndRemFav', isAuth, productController.addAndRemFav);

router.get('/viewWishlist', isAuth, productController.viewWishlist);

module.exports = router;