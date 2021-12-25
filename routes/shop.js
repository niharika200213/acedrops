const express = require('express');
const { body } = require('express-validator');

const shopController = require('../controllers/shop');
const isAuth = require('../middleware/isAuth');
const singleImg = require('../middleware/singleImg');
const uploadImg = require('../middleware/uploadImg');

const router = express.Router();

router.post('/createShop', isAuth, shopController.createShopInfo);

router.post('/createShopAdhaar', isAuth, uploadImg, shopController.createShopAdhaarImg);

router.post('/createShopSellerPic', isAuth, singleImg, shopController.createShopSellerPic);

module.exports = router;