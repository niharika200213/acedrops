const express = require('express');

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/isAuth');

const router = express.Router();

router.post('/verify', adminController.verifyShop);

module.exports = router;