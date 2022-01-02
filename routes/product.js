const express = require('express');

const productController = require('../controllers/product');
const isAuth = require('../middleware/isAuth');

const router = express.Router();

router.post('/createProduct', isAuth, productController.createProduct);

router.get('/home', productController.home);

router.get('/viewProd/:prodId', productController.viewOneProd);

module.exports = router;