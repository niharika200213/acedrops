const { validationResult } = require('express-validator');
const validator = require('aadhaar-validator');

const imgUrl=require('../models/imgUrl');

exports.createShopInfo = async (req, res, next) => {
    try{
        if(req.type!=="shop"){
            const err = new Error('shop does not exists');
            err.statusCode=404;
            throw err; 
        }
        const {shopName,phno,noOfMembers,dob,description,address,fathersName,aadhaarNo} = req.body;
        if(!validator.isValidNumber(aadhaarNo)){
            const err = new Error('aadhaar number is not valid');
            err.statusCode=401;
            throw err; 
        }
        const shop = req.user;
        if(shop.shopName){
            const err = new Error('shop already exists');
            err.statusCode=400;
            throw err; 
        }
        await shop.update({shopName:shopName,phno:phno,dob:dob,noOfMembers:noOfMembers,description:description,
            address:address,fathersName:fathersName,aadhaarNo:aadhaarNo});
        return res.status(200).json({message:'personal information updated'});
    }
    catch(err){
        if(err.name==='SequelizeUniqueConstraintError'||err.name==='SequelizeValidationError'){
            err.errors[0].statusCode=422;
            next(err.errors[0]);
        }
        if(!err.statusCode)
            err.statusCode=500;
        next(err);
    }
};

exports.createShopAdhaarImg = async (req, res, next) => {
    try{
        const {images} = req.body;
        if(images.length!==2){
            const err= new Error('please upload 2 images');
            err.statusCode=401;
            throw err; 
        }
        if(req.type!=="shop"){
            const err= new Error('shop does not exists');
            err.statusCode=404;
            throw err;  
        }
        const shop = req.user;
        if(!shop.shopName){
            const err= new Error('please fill personal information first');
            err.statusCode=401;
            throw err; 
        }
        const adhaar = await imgUrl.findAll({where:{purpose:'adhaar',shopId:shop.id}});
        if(adhaar.length > 0){
            const err= new Error('images already uploaded');
            err.statusCode=401;
            throw err; 
        }
        for(let i=0;i<images.length;++i)
            await imgUrl.create({imageUrl:images[i],purpose:'adhaar',shopId:shop.id});
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
        if(req.type!=="shop"){
            const err= new Error('shop does not exists'); 
            err.statusCode=404;
            throw err; 
        }
        const shop = req.user;
        if(!shop.shopName){
            const err = new Error('please fill personal information first');
            err.statusCode=400;
            throw err; 
        }
        const adhaar = await imgUrl.findAll({where:{purpose:'adhaar',shopId:shop.id}});
        if(adhaar.length < 2){
            const err= new Error('update 2 adhaar card photos first');
            err.statusCode=400;
            throw err; 
        }
        const sellerPic = await imgUrl.findOne({where:{purpose:'sellerPic',shopId:shop.id}});
        if(sellerPic){
            const err= new Error('picture already uploaded');
            err.statusCode=400;
            throw err; 
        }
        await imgUrl.create({imageUrl:req.body.image,purpose:'sellerPic',shopId:shop.id});
        await shop.update({isApplied:true});
        return res.status(200).json({message:'picture uploaded'});
    }
    catch(err){
        if(!err.statusCode)
            err.statusCode=500;
        next(err);
    }
};