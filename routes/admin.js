const express = require('express');

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/isAuth');
const singleImg = require('../middleware/singleImg');
const uploadImg = require('../middleware/uploadImg');

const router = express.Router();

router.post('/verify', adminController.verifyShop);

module.exports = router;