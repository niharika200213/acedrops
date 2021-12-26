const express = require('express');

const productController = require('../controllers/product');
const isAuth = require('../middleware/isAuth');
const singleImg = require('../middleware/singleImg');
const uploadImg = require('../middleware/uploadImg');

const router = express.Router();

router.post('/createProduct', isAuth, uploadImg, productController.createProduct);

module.exports = router;