const express = require('express');
const { body } = require('express-validator');

const sellerController = require('../controllers/seller');
const isAuth = require('../middleware/isAuth');

const router = express.Router();

router.post('/updateProd/:prodId', [
    body('stock').trim().not().isEmpty().withMessage('please enter stock'),
    body('title').trim().not().isEmpty().withMessage('please enter title'),
    body('description').trim().not().isEmpty().withMessage('please enter description'),
    body('basePrice').trim().not().isEmpty().withMessage('please enter base price'),
    body('discountedPrice').trim().not().isEmpty().withMessage('please enter discounted price'),
    body('offers').trim().not().isEmpty().withMessage('please enter offers')
], isAuth, sellerController.updateProd);

router.post('/updateShop', [
    body('shopName').trim().not().isEmpty().withMessage('please enter shop name'),
    body('phno').trim().not().isEmpty().withMessage('please enter your phone number'),
    body('noOfMembers').trim().not().isEmpty().withMessage('please enter number of Members'),
    body('description').trim().not().isEmpty().withMessage('please enter description'),
    body('address').trim().not().isEmpty().withMessage('please enter address'),
], isAuth, sellerController.updateShop);

module.exports = router;