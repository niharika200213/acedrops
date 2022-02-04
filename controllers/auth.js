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

exports.signup = async (req, res, next) => {
    try{
        if(!validationResult(req).isEmpty()){
            const err = new Error(validationResult(req).errors[0].msg);
            err.statusCode=422;
            throw err;
        }

        const {name,email}=req.body;

        //check if user already exists

        const user = await User.findOne({where:{email:email}});
        const shop = await Shop.findOne({where:{email:email}});
        if(user||shop){
            const err = new Error('this email already exists');
            err.statusCode=400;
            throw err;
        }
        
        //generate otp

        const otp=otpgenerator.generate(6, {digits:true, lowerCaseAlphabets:false,
            upperCaseAlphabets:false, specialChars:false});
        mailer.send_mail(email,name,otp,'signup otp');

        /* check for any existing otp for the same user in db
        update it or create new */

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

        //delete expired otps from db

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

        //check if user already exists

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

        //verify otp

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

            //delete verified otp

            await otpInDb.destroy();

            //generate token

            const accesstoken=jwt.sign({id:newUser.id,email:newUser.email},
                process.env.JWT_KEY_ACCESS,{expiresIn:"1h"});
            const refreshtoken=jwt.sign({id:newUser.id,email:newUser.email},
                process.env.JWT_KEY_REFRESH,{expiresIn:"1y"});
            await Token.create({token:refreshtoken,email:email});
            res.status(200).json({message:'signup successful', name:newUser.name, email:newUser.email,
                access_token:accesstoken,refresh_token:refreshtoken, id: newUser.id,googleId:null});
        }
        else{
            const err = new Error('wrong otp');
            err.statusCode=401;
            throw err;
        }
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

        //check if account does not exists

        if((!user)&&(!shop)){
            const err = new Error('user does not exists please signup');
            err.statusCode=404;
            throw err;
        }

        //compare password

        if(user)
            isValidUser = await bcrypt.compare(password,user.password);
        else if(shop)
            isValidShop = await bcrypt.compare(password,shop.password);

        //generate token if password is correct

        if(isValidUser)
        {
            newUser = user;
            accesstoken=jwt.sign({id:user.id,email:email},
            process.env.JWT_KEY_ACCESS,{expiresIn:"1h"});
            refreshtoken=jwt.sign({id:user.id,email:email},
            process.env.JWT_KEY_REFRESH,{expiresIn:"1y"});
        }
        else if(isValidShop)
        {
            newUser = shop;
            status=shop.status;
            accesstoken=jwt.sign({id:shop.id,email:email},
            process.env.JWT_KEY_ACCESS,{expiresIn:"1h"});
            refreshtoken=jwt.sign({id:shop.id,email:email},
            process.env.JWT_KEY_REFRESH,{expiresIn:"1y"});
        }

        //save token in db

        if(isValidShop||isValidUser)
        {
            await Token.create({token:refreshtoken,email:email});
            return res.status(200).json({status:status,name:newUser.name,email:email,
                access_token:accesstoken,refresh_token:refreshtoken,id:newUser.id,googleId:newUser.googleId});
        }

        //throw error on wrong password
        
        else{
            const err = new Error('wrong password');
            err.statusCode=401;
            throw err;
        }
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

        //find if account already exists

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

        //create new account if it does not exists

        if(!newUser){
            if(!isShop)
                newUser = await User.create({name:req.user.name,
                    email:req.user.email,googleId:req.user.googleId});
            else if(isShop)
                newUser = await Shop.create({name:req.user.name,
                    email:req.user.email,googleId:req.user.googleId});
        
        }   

        //generate tokens and save refreshtoken

        const accesstoken=jwt.sign({id:newUser.id,email:req.user.email},
        process.env.JWT_KEY_ACCESS,{expiresIn:"1h"});
        const refreshtoken=jwt.sign({id:newUser.id,email:req.user.email},
        process.env.JWT_KEY_REFRESH,{expiresIn:"1y"});

        await Token.create({token:refreshtoken,email:req.user.email});
        return res.status(200).json({status:status,access_token:accesstoken,name:newUser.name,
            email:newUser.email,refresh_token:refreshtoken,id:newUser.id,googleId:newUser.googleId});
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

        /* if token is correct but it does not exists in the db
        means the user has already logged out but somehow the refreshtoken is accessed
        by someone through unethical ways then a new access token will not be generated*/

        const tokenInDb = await Token.findOne({where:{token:refreshtoken}});
        if(!tokenInDb){
            const err = new Error('login again');
            err.statusCode=402;
            throw err;
        }
        const payload = jwt.verify(tokenInDb.token, process.env.JWT_KEY_REFRESH);
        const accessToken = jwt.sign({id:payload.id,email:payload.email}, 
            process.env.JWT_KEY_ACCESS, {expiresIn: "1d"});
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

        //delete token from db

        if(tokenInDb){
            await tokenInDb.destroy();
            return res.status(200).json({message:'logged out'});
        }
        else{
            const err = new Error('error logging out');
            err.statusCode=400;
            throw err;
        }
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

        //check if account does not exists

        if((!user)&&(!shop)){
            const err = new Error('user does not exists please signup');
            err.statusCode =404;
            throw err;
        }
        if(user)
            newUser = user;
        else if(shop)
            newUser = shop;

        //generate otp, update existing otp or create new one

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

        //delete expired otps from db

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

        //update status in db after verification
        //check if otp was meant for forgot password purpose

        if(otpInDb.purpose==="forgot password")
        {
            await otpInDb.update({purpose:"forgot password verified"});
            return res.status(200).json({message:'correct otp'});
        }
        else{
            const err = new Error('try again');
            err.statusCode=400;
            throw err;    
        }
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
        
        //delete expired otps

        let date = new Date(Date.now()-300000);
        date = moment({year:date.getFullYear(),month:date.getMonth(),
            day:date.getDate(),hour:date.getHours(),minute:date.getMinutes(),
            second :date.getSeconds(),millisecond:date.getMilliseconds()}).format().replace('T',' ');
        await Otp.destroy({where:{updatedAt:{[Op.lt]:date}}});

        const {email,newpass} = req.body;

        //find otp in db which has status: forgot password verified
        const otpInDb = await Otp.findOne({where:{[Op.and]:
            [{purpose:"forgot password verified"},{email:email}]}});
        
        //if otp has expired then throw session expired error
        //allow user to set new password only for few minutes
        /*for example user has verified otp and he/she is trying 
        to set new password after 10 hours then this should not 
        be allowed because it can pose a security threat*/

        if(!otpInDb){
            const err = new Error('session expired');
            err.statusCode=401;
            throw err;
        }

        //find account and update password if account exists

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
            else{
                const err= new Error('try again');
                err.statusCode=400;
                throw err;
            }
        }
        
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

        //if user wants to change the old password

        let isValidUser,isValidShop,newUser;
        const {email,password,newpass} = req.body;
        const user = await User.findOne({where:{email:email}});
        const shop = await Shop.findOne({where:{email:email}});

        //check if account exists

        if((!user)&&(!shop)){
            const err= new Error('user does not exists please signup');
            err.statusCode=404;
            throw err;
        }

        //can't change password if user is signed in through google

        if(user){
            if(user.googleId){
                const err= new Error('you cannot change password you can only reset it');
                err.statusCode=400;
                throw err;
            }
            isValidUser = await bcrypt.compare(password,user.password);
        }
        else if(shop){
            if(shop.googleId){
                const err= new Error('you cannot change password you can only reset it');
                err.statusCode=400;
                throw err;
            }
            isValidShop = await bcrypt.compare(password,shop.password);
        }

        //update password

        if(isValidUser)
            newUser = user;
        else if(isValidShop)
            newUser = shop;
        if(newUser){
            const hashedPw = await bcrypt.hash(newpass, 12);
            await newUser.update({password:hashedPw});
            return res.status(200).json({message:"password changed"});
        }
        else{
            const err = new Error('wrong password');
            err.statusCode=401;
            throw err;
        }
    }
    catch(err){
        if(!err.statusCode)
            err.statusCode=500;
        next(err);
    }
};