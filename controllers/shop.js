const { validationResult } = require('express-validator');
const validator = require('aadhaar-validator');

const imgUrl=require('../models/imgUrl');
const path=require('path');
const fs=require('fs');

const clearImg = imgArray => {
        for(let i=0; i<imgArray.length; ++i){
            var filepath = path.join(__dirname, '../images', imgArray[i]);
            fs.unlink(filepath, err => console.log(err));
        }
};

exports.createShopInfo = async (req, res, next) => {
    try{
        if(!validationResult(req).isEmpty())
            throw new Error(validationResult(req).errors[0].msg);
        if(req.type!=="shop")
            throw new Error('shop does not exists'); 
        const {shopName,phno,noOfMembers,dob,description,address,fathersName,aadhaarNo} = req.body;
        if(!validator.isValidNumber(aadhaarNo))
            throw new Error('aadhaar number is not valid');
        const shop = req.user;
        if(shop.shopName)
            throw new Error('shop already exists');
        await shop.update({shopName:shopName,phno:phno,dob:dob,noOfMembers:noOfMembers,description:description,
            address:address,fathersName:fathersName,aadhaarNo:aadhaarNo});
        return res.status(200).json({message:'personal information updated'});
    }
    catch(err){
        if(err.name==='SequelizeUniqueConstraintError')
            next(err.errors[0]);
        if(!err.statusCode)
            err.statusCode=500;
        next(err);
    }
};

exports.createShopAdhaarImg = async (req, res, next) => {
    try{
        if(!validationResult(req).isEmpty()){
            clearImg(req.images);
            throw new Error(validationResult(req).errors[0].msg);
        }
        if(req.type!=="shop"){
            clearImg(req.images);
            throw new Error('shop does not exists'); 
        }
        const shop = req.user;
        if(!shop.shopName){
            clearImg(req.images);
            throw new Error('please fill personal information first');
        }
        const adhaar = await imgUrl.findAll({where:{purpose:'adhaar',shopId:shop.id}});
        if(adhaar.length === 2){
            clearImg(req.images);
            throw new Error('images already uploaded');
        }
        for(let i=0;i<req.images.length;++i)
            await imgUrl.create({imageUrl:req.images[i],purpose:'adhaar',shopId:shop.id});
        return res.status(200).json({message:'adhaar card updated'});
    }
    catch(err){
        if(!err.statusCode)
            err.statusCode=500;
        next(err);
    }
};

exports.createShopSellerPic = async (req, res, next) => {
    try{
        if(!validationResult(req).isEmpty()){
            clearImg(Array(req.image));
            throw new Error(validationResult(req).errors[0].msg);
        }
        if(req.type!=="shop"){
            clearImg(Array(req.image));
            throw new Error('shop does not exists'); 
        }
        const shop = req.user;
        if(!shop.shopName){
            clearImg(Array(req.image));
            throw new Error('please fill personal information first');
        }
        const adhaar = await imgUrl.findAll({where:{purpose:'adhaar',shopId:shop.id}});
        if(adhaar.length !== 2){
            clearImg(Array(req.image));
            throw new Error('update 2 adhaar card photos first');
        }
        const sellerPic = await imgUrl.findOne({where:{purpose:'sellerPic',shopId:shop.id}});
        if(sellerPic){
            clearImg(Array(req.image));
            throw new Error('picture already uploaded');
        }
        await imgUrl.create({imageUrl:req.image,purpose:'sellerPic',shopId:shop.id});
        await shop.update({isApplied:true});
        return res.status(200).json({message:'picture uploaded'});
    }
    catch(err){
        if(!err.statusCode)
            err.statusCode=500;
        next(err);
    }
};