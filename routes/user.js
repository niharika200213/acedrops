const express = require('express');

const userControllers = require('../controllers/user');
const isAuth = require('../middleware/isAuth');

const router = express.Router();

router.get('/search', userControllers.search);

module.exports = router;