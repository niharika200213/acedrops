const express = require('express');
const { body } = require('express-validator');

const shopController = require('../controllers/shop');
const isAuth = require('../middleware/isAuth');
const uploadImg = require('../middleware/uploadImg');

const router = express.Router();

router.post('/createShop', isAuth, uploadImg, shopController.createShop);

module.exports = router;