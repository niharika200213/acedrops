const express = require('express');

const shopController = require('../controllers/shop');
const isAuth = require('../middleware/isAuth');
const singleImg = require('../middleware/singleImg');
const uploadImg = require('../middleware/uploadImg');

const router = express.Router();

router.post('/createShop', isAuth, shopController.createShopInfo);

router.post('/createShopAdhaar', isAuth, uploadImg, shopController.createShopAdhaarImg);

router.post('/createShopSellerPic', isAuth, singleImg, shopController.createShopSellerPic);

router.delete('/deleteShop', isAuth, shopController.deleteShop);

module.exports = router;