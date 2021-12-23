const bcrypt = require("bcryptjs");
const jwt=require('jsonwebtoken');
const { validationResult } = require('express-validator');
const otpgenerator=require('otp-generator'); 
const moment=require("moment");
const { Op } = require("sequelize");
const validator = require('aadhaar-validator');

const User = require('../models/user');
const Token=require('../models/token');
const Otp=require('../models/otp');
const Shop=require('../models/shop');

const mailer=require('../helpers/mailer');

exports.createShop = async (req, res, next) => {
    try{
        if(!validationResult(req).isEmpty())
            throw new Error(validationResult(req).errors[0].msg);
        if(req.type!=="shop")
            throw new Error('shop does not exists'); 
        const {shopName,phno,noOfMembers,description,address,fathersName,aadhaarNo} = req.body;
        if(!validator.isValidNumber(aadhaarNo))
            throw new Error('aadhaar number is not valid');
        const shop = req.user;
        const newShop = await shop.update({shopName:shopName,phno:phno,noOfMembers:noOfMembers,description:description,
            address:address,fathersName:fathersName});
        for(let i=0;i<(req.images).length;++i)
            await newShop.addimgUrl({imageUrl:req.images[i],purpose:'credentials'});
        await newShop.addimgUrl({imageUrl:req.image,purpose:'coverPic'});
        return res.status(200).json({message:'you can start selling after verification'});
    }
    catch(err){
        if(!err.statusCode)
            err.statusCode=500;
        next(err);
    }
};