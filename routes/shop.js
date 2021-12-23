const express = require('express');
const { body } = require('express-validator');

const shopController = require('../controllers/shop');
const isAuth = require('../middleware/isAuth');
const singleImg = require('../middleware/singleImg');
const uploadImg = require('../middleware/uploadImg');

const router = express.Router();

router.post('/createShop', isAuth, singleImg, uploadImg, shopController.createShop);

module.exports = router;