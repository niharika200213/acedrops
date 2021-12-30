const express = require('express');

const shopController = require('../controllers/shop');
const isAuth = require('../middleware/isAuth');

const router = express.Router();

router.post('/createShop', isAuth, shopController.createShopInfo);

router.post('/createShopAdhaar', isAuth, shopController.createShopAdhaarImg);

router.post('/createShopSellerPic', isAuth, shopController.createShopSellerPic);

module.exports = router;