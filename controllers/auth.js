const bcrypt = require("bcryptjs");
const jwt=require('jsonwebtoken');
const { validationResult } = require('express-validator');
const otpgenerator=require('otp-generator'); 

const User = require('../models/user');
const Token=require('../models/token');
const Otp=require('../models/otp');
const Shop=require('../models/shop');

const mailer=require('../helpers/mailer');

exports.signup = async (req, res, next) => {
    try{
        if(!validationResult(req).isEmpty())
            throw new Error(validationResult(req).errors[0].msg);

        const {name,email}=req.body;

        const user = await User.findOne({where:{email:email}});
        const shop = await Shop.findOne({where:{email:email}});
        if(user||shop)
            throw new Error('this email already exists');
        
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
        if(!err.statusCode)
            err.statusCode=500;
        next(err);
    }
};

exports.signup_verify = async (req, res, next) => {
    try{
        if(!validationResult(req).isEmpty())
            throw new Error(validationResult(req).errors[0].msg);

        const {email,name,password,otp} = req.body;

        const user = await User.findOne({where:{email:email}});
        const shop = await Shop.findOne({where:{email:email}});
        if(user||shop)
            throw new Error('this email already exists');

        await Otp.destroy({where:{[updatedAt.lt]:(Date.now()-300000)}})
        const otpInDb = Otp.findOne({where:{email:email}});
        if(!otpInDb)
            throw new Error('otp expired');

        if(otpInDb.otp===otp){
            const hashedPw = await bcrypt.hash(password, 12);
            const newUser = await User.create({
                name:name,email:email,password:hashedPw
            });
            await otpInDb.destroy();
            const accesstoken=jwt.sign({id:newUser.id,email:newUser.email},
                process.env.JWT_KEY_ACCESS,{expiresIn:"10m"});
            const refreshtoken=jwt.sign({id:newUser.id,email:newUser.email},
                process.env.JWT_KEY_REFRESH,{expiresIn:"1y"});
            await Token.create({token:refreshtoken,email:email});
            res.status(200).json({message:'signup successful',
            access_token:accesstoken,refresh_token:refreshtoken});
        }
        throw new Error('wrong otp');
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
        if(!refreshtoken)
            throw new Error('token missing');
        const tokenInDb = await Token.findOne({where:{token:refreshtoken}});
        if(!tokenInDb)
            throw new Error('login again');
        const payload = jwt.verify(tokenInDb.token, process.env.JWT_KEY_REFRESH);
        const accessToken = jwt.sign({id:payload.id,email:payload.email}, 
            process.env.JWT_KEY_ACCESS, {expiresIn: "10m"});
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
        await tokenInDb.destroy();
        return res.status(200).json({message:'logged out'});
    }
    catch(err){
        if(!err.statusCode)
            err.statusCode=500;
        next(err);
    }
};

exports.login = async (req,res,next) => {
    try{
        let isValid;
        const {email,password} = req.body;
        const user = await User.findOne({where:{email:email}});
        const shop = await User.findOne({where:{email:email}});
        if((!user)&&(!shop))
            throw new Error('user does not exists please signup');
        if(user)
            isValid = await bcrypt.compare(password,user.password);
        else if(shop)
            isValid = await bcrypt.compare(password,shop.password);
        if(isValid)
        {
            const accesstoken=jwt.sign({id:user.id,email:email},
            process.env.JWT_KEY_ACCESS,{expiresIn:"10m"});
            const refreshtoken=jwt.sign({id:user.id,email:email},
            process.env.JWT_KEY_REFRESH,{expiresIn:"1y"});
            const tokenInDb = await Token.findOne({where:{email:email}});
            if(tokenInDb)
                await tokenInDb.update({token:refreshtoken});
            else
                await Token.create({token:refreshtoken,email:email});
            return res.status(200).json({access_token:accesstoken,refresh_token:refreshtoken});
        }
        throw new Error('wrong password');
    }
    catch(err){
        if(!err.statusCode)
            err.statusCode=500;
        next(err);
    }
};