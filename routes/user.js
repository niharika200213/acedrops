const express = require('express');

const userControllers = require('../controllers/user');
const isAuth = require('../middleware/isAuth');
const noAuth = require('../middleware/noAuth');

const router = express.Router();

router.get('/search', noAuth, userControllers.search);

router.post('/reviews/:prodId', isAuth, userControllers.rate);

router.post('/addAddress', isAuth, userControllers.addAddress);

router.post('/addPhno', isAuth, userControllers.addPhno);

router.get('/getAddress', isAuth, userControllers.getAddress);

router.post('/orderCart', isAuth, userControllers.orderCart);

router.post('/orderProd', isAuth, userControllers.orderProd);

router.post('/cancelOrder/:orderId', isAuth, userControllers.cancelOrder);

router.get('/getOrders', isAuth, userControllers.getOrders);

module.exports = router;