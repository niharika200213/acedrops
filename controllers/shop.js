const bcrypt = require("bcryptjs");
const jwt=require('jsonwebtoken');
const { validationResult } = require('express-validator');
const otpgenerator=require('otp-generator'); 
const moment=require("moment");
const { Op } = require("sequelize");

const User = require('../models/user');
const Token=require('../models/token');
const Otp=require('../models/otp');
const Shop=require('../models/shop');

const mailer=require('../helpers/mailer');

exports.createShop = async (req, res, next) => {
    try{
        if(!validationResult(req).isEmpty())
            throw new Error(validationResult(req).errors[0].msg);
        
        const {shopName,phno,noOfMembers,description,address,fathersName} = req.body;
        
    }
    catch(err){
        if(!err.statusCode)
            err.statusCode=500;
        next(err);
    }
};