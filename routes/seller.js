const express = require('express');
const { body } = require('express-validator');

const sellerController = require('../controllers/seller');
const isAuth = require('../middleware/isAuth');

const router = express.Router();

router.post('/updateShop', [
    body('shopName').trim().not().isEmpty().withMessage('please enter shop name'),
    body('phno').trim().not().isEmpty().withMessage('please enter your phone number'),
    body('noOfMembers').trim().not().isEmpty().withMessage('please enter number of Members'),
    body('description').trim().not().isEmpty().withMessage('please enter description'),
    body('address').trim().not().isEmpty().withMessage('please enter address'),
], isAuth, sellerController.updateShop);

router.get('/getProds', isAuth, sellerController.getProds);

router.get('/getOrders', isAuth, sellerController.getOrders);

router.get('/getPrevOrders', isAuth, sellerController.getPrevOrders);

router.post('/acceptOrder', isAuth, sellerController.acceptOrder);

router.post('/rejectOrder', isAuth, sellerController.rejectOrder);

module.exports = router;