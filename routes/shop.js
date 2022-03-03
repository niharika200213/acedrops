const express = require('express');
const { body } = require('express-validator');

const shopController = require('../controllers/shop');
const isAuth = require('../middleware/isAuth');

const router = express.Router();

router.post('/createShop', [
    body('shopName').trim().not().isEmpty().withMessage('please enter shop name'),
    body('description').trim().not().isEmpty().withMessage('please enter description'),
    body('address').trim().not().isEmpty().withMessage('please enter address'),
    body('fathersName').trim().not().isEmpty().withMessage('please enter fathers name'),
], isAuth, shopController.createShopInfo);

router.post('/createShopAdhaar', [
    body('images').not().isEmpty().withMessage('please upload images')
], isAuth, shopController.createShopAdhaarImg);

router.post('/createShopSellerPic', [
    body('image').not().isEmpty().withMessage('please upload image')
], isAuth, shopController.createShopSellerPic);

router.post('/coverPic', [
    body('image').not().isEmpty().withMessage('please upload image')
], isAuth, shopController.coverPic);

router.get('/viewOneShop/:shopId', shopController.viewOneShop);

module.exports = router;