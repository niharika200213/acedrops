const bcrypt = require("bcryptjs");
const jwt=require('jsonwebtoken');
const { validationResult } = require('express-validator');
const otpgenerator=require('otp-generator'); 
const moment=require("moment");
const { Op, Error } = require("sequelize");

const User = require('../models/user');
const Token=require('../models/token');
const Otp=require('../models/otp');
const Shop=require('../models/shop');

const mailer=require('../helpers/mailer');
const imgUrl = require("../models/imgUrl");

exports.signup = async (req, res, next) => {
    try{
        if(!validationResult(req).isEmpty()){
            const err = new Error(validationResult(req).errors[0].msg);
            err.statusCode=422;
            throw err;
        }

        const {name,email}=req.body;

        const user = await User.findOne({where:{email:email}});
        const shop = await Shop.findOne({where:{email:email}});
        if(user||shop){
            const err = new Error('this email already exists');
            err.statusCode=400;
            throw err;
        }
        
        const otp=otpgenerator.generate(6, {digits:true, lowerCaseAlphabets:false,
            upperCaseAlphabets:false, specialChars:false});
        mailer.send_mail(email,name,otp,'signup otp');

        let existing_otp = await Otp.findOne({ where: { email: email } });
        if(existing_otp)
            await existing_otp.update({otp:otp});
        else
            await Otp.create({otp:otp,email:email});
        return res.status(200).json({message:'otp sent successfully'});
    }
    catch(err){
        if(err.name==='SequelizeUniqueConstraintError'||err.name==='SequelizeValidationError')
            next(err.errors[0]);
        if(!err.statusCode)
            err.statusCode=500;
        next(err);
    }
};

exports.signup_verify = async (req, res, next) => {
    try{
        let newUser;
        let date = new Date(Date.now()-300000);
        date = moment({year:date.getFullYear(),month:date.getMonth(),
            day:date.getDate(),hour:date.getHours(),minute:date.getMinutes(),
            second :date.getSeconds(),millisecond:date.getMilliseconds()}).format().replace('T',' ');
        await Otp.destroy({where:{updatedAt:{[Op.lt]:date}}});

        if(!validationResult(req).isEmpty()){
            const err = new Error(validationResult(req).errors[0].msg);
            err.statusCode=422;
            throw err;
        }
        const {email,name,password,otp,isShop} = req.body;

        const user = await User.findOne({where:{email:email}});
        const shop = await Shop.findOne({where:{email:email}});
        if(user||shop){
            const err = new Error('this email already exists');
            err.statusCode=400;
            throw err;
        }

        const otpInDb = await Otp.findOne({where:{email:email}});
        if(!otpInDb){
            const err = new Error('otp expired');
            err.statusCode=404;
            throw err;
        }

        if(otpInDb.otp===otp){
            if(!isShop)
            {
                const hashedPw = await bcrypt.hash(password, 12);
                newUser = await User.create({
                    name:name,email:email,password:hashedPw
                });
            }
            else if(isShop)
            {
                const hashedPw = await bcrypt.hash(password, 12);
                newUser = await Shop.create({
                    name:name,email:email,password:hashedPw
                });
            }
            await otpInDb.destroy();
            const accesstoken=jwt.sign({id:newUser.id,email:newUser.email},
                process.env.JWT_KEY_ACCESS,{expiresIn:"10m"});
            const refreshtoken=jwt.sign({id:newUser.id,email:newUser.email},
                process.env.JWT_KEY_REFRESH,{expiresIn:"1y"});
            await Token.create({token:refreshtoken,email:email});
            res.status(200).json({message:'signup successful', name:newUser.name, email:newUser.email,
                access_token:accesstoken,refresh_token:refreshtoken, id: newUser.id});
        }
        const err = new Error('wrong otp');
        err.statusCode=401;
        throw err;
    }
    catch(err){
        if(err.name==='SequelizeUniqueConstraintError'||err.name==='SequelizeValidationError')
            next(err.errors[0]);
        if(!err.statusCode)
            err.statusCode=500;
        next(err);
    }
};

exports.login = async (req,res,next) => {
    try{
        if(!validationResult(req).isEmpty()){
            const err = new Error(validationResult(req).errors[0].msg);
            err.statusCode=422;
            throw err;
        }
        let isValidUser,isValidShop,accesstoken,refreshtoken,newUser,status=-1;
        const {email,password} = req.body;
        const user = await User.findOne({where:{email:email}});
        const shop = await Shop.findOne({where:{email:email}});
        if((!user)&&(!shop)){
            const err = new Error('user does not exists please signup');
            err.statusCode=404;
            throw err;
        }
        if(user)
            isValidUser = await bcrypt.compare(password,user.password);
        else if(shop)
            isValidShop = await bcrypt.compare(password,shop.password);
        if(isValidUser)
        {
            newUser = user;
            accesstoken=jwt.sign({id:user.id,email:email},
            process.env.JWT_KEY_ACCESS,{expiresIn:"10m"});
            refreshtoken=jwt.sign({id:user.id,email:email},
            process.env.JWT_KEY_REFRESH,{expiresIn:"1y"});
        }
        else if(isValidShop)
        {
            newUser = shop;
            status=shop.status;
            accesstoken=jwt.sign({id:shop.id,email:email},
            process.env.JWT_KEY_ACCESS,{expiresIn:"10m"});
            refreshtoken=jwt.sign({id:shop.id,email:email},
            process.env.JWT_KEY_REFRESH,{expiresIn:"1y"});
        }
        if(isValidShop||isValidUser)
        {
            await Token.create({token:refreshtoken,email:email});
            return res.status(200).json({status:status,name:newUser.name,email:email,
                access_token:accesstoken,refresh_token:refreshtoken,id:newUser.id});
        }
        const err = new Error('wrong password');
        err.statusCode=401;
        throw err;
    }
    catch(err){
        if(!err.statusCode)
            err.statusCode=500;
        next(err);
    }
};

exports.googleSignup = async (req,res,next) => {
    try{
        let newUser,status=-1;
        const {isShop} = req.body;
        if(!isShop){
            const user = await User.findOne({where:{email:req.user.email}});
            newUser = user;
        }
        else if(isShop){
            const shop = await Shop.findOne({where:{email:req.user.email}});
            newUser = shop;  
            if(shop)
                status=shop.status;
        }     
        if(!newUser){
            if(!isShop)
                newUser = await User.create({name:req.user.name,
                    email:req.user.email,googleId:req.user.googleId});
            else if(isShop)
                newUser = await Shop.create({name:req.user.name,
                    email:req.user.email,googleId:req.user.googleId});
        
        }   
        const accesstoken=jwt.sign({id:newUser.id,email:req.user.email},
        process.env.JWT_KEY_ACCESS,{expiresIn:"10m"});
        const refreshtoken=jwt.sign({id:newUser.id,email:req.user.email},
        process.env.JWT_KEY_REFRESH,{expiresIn:"1y"});

        await Token.create({token:refreshtoken,email:req.user.email});
        return res.status(200).json({status:status,access_token:accesstoken,name:newUser.name,
            email:newUser.email,refresh_token:refreshtoken,id:newUser.id});
    }
    catch(err){
        if(!err.statusCode)
            err.statusCode=500;
        next(err);
    }
};

exports.generate_access_token = async (req,res,next) => {
    try{
        const {refreshtoken} = req.body;
        if(!refreshtoken){
            const err = new Error('token missing');
            err.statusCode=401;
            throw err;
        }
        const tokenInDb = await Token.findOne({where:{token:refreshtoken}});
        if(!tokenInDb){
            const err = new Error('login again');
            err.statusCode=402;
            throw err;
        }
        const payload = jwt.verify(tokenInDb.token, process.env.JWT_KEY_REFRESH);
        const accessToken = jwt.sign({id:payload.id,email:payload.email}, 
            process.env.JWT_KEY_ACCESS, {expiresIn: "10d"});
        return res.status(200).json({access_token:accessToken});
    }
    catch(err){
        if(!err.statusCode)
            err.statusCode=500;
        next(err);
    }
};

exports.logout = async (req,res,next) => {
    try{
        const { refreshToken } = req.body;
        const tokenInDb = await Token.findOne({where:{token:refreshToken}});
        if(tokenInDb){
            await tokenInDb.destroy();
            return res.status(200).json({message:'logged out'});
        }
        const err = new Error('error logging out');
        err.statusCode=400;
        throw err;
    }
    catch(err){
        if(!err.statusCode)
            err.statusCode=500;
        next(err);
    }
};

exports.forgotPass = async (req,res,next) => {
    try{
        if(!validationResult(req).isEmpty()){
            const err = new Error(validationResult(req).errors[0].msg);
            err.statusCode=422;
            throw err;
        }
        let newUser;
        const {email} = req.body;
        const user = await User.findOne({where:{email:email}});
        const shop = await Shop.findOne({where:{email:email}});
        if((!user)&&(!shop)){
            const err = new Error('user does not exists please signup');
            err.statusCode =404;
            throw err;
        }
        if(user)
            newUser = user;
        else if(shop)
            newUser = shop;
        const otp=otpgenerator.generate(6, {digits:true, lowerCaseAlphabets:false,
            upperCaseAlphabets:false, specialChars:false});
        mailer.send_mail(email,newUser.name,otp,'forgot password otp');

        let existing_otp = await Otp.findOne({ where: { email: email } });
        if(existing_otp)
            await existing_otp.update({otp:otp,purpose:"forgot password"});
        else
            await Otp.create({otp:otp,email:email,purpose:"forgot password"});
        return res.status(200).json({message:'otp sent successfully'});
    }
    catch(err){
        if(!err.statusCode)
            err.statusCode=500;
        next(err);
    }
};

exports.forgotPassVerify = async (req,res,next) => {
    try{
        if(!validationResult(req).isEmpty()){
            const err = new Error(validationResult(req).errors[0].msg);
            err.statusCode=422;
            throw err;
        }
        const {otp,email} = req.body;
        let date = new Date(Date.now()-300000);
        date = moment({year:date.getFullYear(),month:date.getMonth(),
            day:date.getDate(),hour:date.getHours(),minute:date.getMinutes(),
            second :date.getSeconds(),millisecond:date.getMilliseconds()}).format().replace('T',' ');
        await Otp.destroy({where:{updatedAt:{[Op.lt]:date}}});

        const otpInDb = await Otp.findOne({where:{[Op.and]:[{otp:otp},{email:email}]}});
        if(!otpInDb){
            const err = new Error('otp expired or wrong otp');
            err.statusCode=401;
            throw err;
        }

        if(otpInDb.purpose==="forgot password")
        {
            await otpInDb.update({purpose:"forgot password verified"});
            return res.status(200).json({message:'correct otp'});
        }
        const err = new Error('try again');
        err.statusCode=400;
        throw err;
    }
    catch(err){
        if(!err.statusCode)
            err.statusCode=500;
        next(err);
    }
};

exports.newpass = async (req,res,next) => {
    try{
        if(!validationResult(req).isEmpty()){
            const err = new Error(validationResult(req).errors[0].msg);
            err.statusCode=422;
            throw err;
        }
        
        let date = new Date(Date.now()-300000);
        date = moment({year:date.getFullYear(),month:date.getMonth(),
            day:date.getDate(),hour:date.getHours(),minute:date.getMinutes(),
            second :date.getSeconds(),millisecond:date.getMilliseconds()}).format().replace('T',' ');
        await Otp.destroy({where:{updatedAt:{[Op.lt]:date}}});

        const {email,newpass} = req.body;
        const otpInDb = await Otp.findOne({where:{[Op.and]:
            [{purpose:"forgot password verified"},{email:email}]}});
        if(!otpInDb){
            const err = new Error('session expired');
            err.statusCode=401;
            throw err;
        }
        const user = await User.findOne({where:{email:email}});
        if(user){
            const hashedPw = await bcrypt.hash(newpass, 12);
            await user.update({password:hashedPw});
            otpInDb.destroy();
            return res.status(200).json({message:"password changed"});
        }
        else{
            const shop = await Shop.findOne({where:{email:email}});
            if(shop)
            {
                const hashedPw = await bcrypt.hash(newpass, 12);
                await shop.update({password:hashedPw});
                otpInDb.destroy();
                return res.status(200).json({message:"password changed"});
            }
        }
        const err= new Error('try again');
        err.statusCode=400;
        throw err;
    }
    catch(err){
        if(!err.statusCode)
            err.statusCode=500;
        next(err);
    }
};

exports.changePass = async (req,res,next) => {
    try{
        if(!validationResult(req).isEmpty()){
            const err = new Error(validationResult(req).errors[0].msg);
            err.statusCode=422;
            throw err;
        }
        let isValidUser,isValidShop,newUser;
        const {email,password,newpass} = req.body;
        const user = await User.findOne({where:{email:email}});
        const shop = await Shop.findOne({where:{email:email}});
        if((!user)&&(!shop)){
            const err= new Error('user does not exists please signup');
            err.statusCode=404;
            throw err;
        }
        if(user)
            isValidUser = await bcrypt.compare(password,user.password);
        else if(shop)
            isValidShop = await bcrypt.compare(password,shop.password);
        if(isValidUser)
            newUser = user;
        else if(isValidShop)
            newUser = shop;
        if(newUser){
            const hashedPw = await bcrypt.hash(newpass, 12);
            await newUser.update({password:hashedPw});
            return res.status(200).json({message:"password changed"});
        }
        const err = new Error('wrong password');
        err.statusCode=401;
        throw err;
    }
    catch(err){
        if(!err.statusCode)
            err.statusCode=500;
        next(err);
    }
};