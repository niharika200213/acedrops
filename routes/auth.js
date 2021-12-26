const express = require('express');
const { body } = require('express-validator');

const authController = require('../controllers/auth');
const isAuthGoogle = require('../middleware/isAuthGoogle');

const router = express.Router();

router.post('/signup',[
    body('email')
        .trim()
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
        .trim()
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
        .trim()
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

router.post('/loginGoogle', isAuthGoogle, authController.googleLogin);

router.post('/signupGoogle', isAuthGoogle, authController.googleSignup);

router.post('/forgotPass', [
    body('email')
        .trim()
        .isEmail()
        .withMessage('please enter a valid email')
        .normalizeEmail()
], authController.forgotPass);

router.post('/forgotPassVerify', [
    body('email')
        .trim()
        .isEmail()
        .withMessage('please enter a valid email')
        .normalizeEmail(),
    body('otp')
        .trim()
        .not()
        .isEmpty()
        .withMessage('please enter otp')
], authController.forgotPassVerify);

router.post('/newpass', [
    body('email')
        .trim()
        .isEmail()
        .withMessage('please enter a valid email')
        .normalizeEmail(),
    body('newpass')
        .trim()
        .isLength({ min: 8 })
        .withMessage('password must be atleast 8 characters long')
        .isLength({ max: 50 })
        .withMessage('password must be at-max 50 characters long'),
], authController.newpass);

router.post('/changePass', [
    body('email')
        .trim()
        .isEmail()
        .withMessage('please enter a valid email')
        .normalizeEmail(),
    body('newpass')
        .trim()
        .isLength({ min: 8 })
        .withMessage('password must be atleast 8 characters long')
        .isLength({ max: 50 })
        .withMessage('password must be at-max 50 characters long'),
], authController.changePass);
    
module.exports = router;