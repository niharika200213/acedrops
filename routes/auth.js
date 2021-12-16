const express = require('express');
const { body } = require('express-validator');
const User = require('../models/user');

const authController = require('../controllers/auth');

const router = express.Router();

router.post('/signup',[
    body('email')
        .isEmail()
        .withMessage('please enter a valid email')
        .normalizeEmail(),
    body('name')
        .trim()
        .not()
        .isEmpty()
        .withMessage('please enter your name')
        .isAlphanumeric()
        .withMessage('please enter a valid name')
        .isLength({ max: 50 })
        .withMessage('name is too long!! only 50 characters are allowed')
    ], authController.signup);

router.post('/signup/verify',[
    body('email')
        .isEmail()
        .withMessage('please enter a valid email')
        .normalizeEmail(),
    body('name')
        .trim()
        .not()
        .isEmpty()
        .withMessage('please enter your name')
        .isAlphanumeric()
        .withMessage('please enter a valid name')
        .isLength({ max: 50 })
        .withMessage('name is too long!! only 50 characters are allowed'),
    body('password')
        .trim()
        .isLength({ min: 8 })
        .withMessage('password must be atleast 8 characters long')
        .isLength({ max: 50 })
        .withMessage('password must be at-max 50 characters long'),
    body('otp')
        .trim()
        .not()
        .isEmpty()
        .withMessage('please enter otp')
    ], authController.signup_verify);

router.post('/generateToken', authController.generate_access_token);

router.post('/logout', authController.logout);

router.post('/login', [
    body('email')
        .isEmail()
        .withMessage('please enter a valid email')
        .normalizeEmail(),
    body('password')
        .trim()
        .isLength({ min: 8 })
        .withMessage('password must be atleast 8 characters long')
        .isLength({ max: 50 })
        .withMessage('password must be at-max 50 characters long'),
    ],authController.login);
    
module.exports = router;
