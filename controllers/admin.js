const { validationResult } = require('express-validator');

const imgUrl=require('../models/imgUrl');
const path=require('path');
const fs=require('fs');
const Shop=require('../models/shop');
const product=require('../models/product');
const product_category=require('../models/product_category');
const Category=require('../models/categories');
const mailer=require('../helpers/mailer');

const clearImg = imgArray => {
    for(let i=0; i<imgArray.length; ++i){
        var filepath = path.join(__dirname, '../images', imgArray[i]);
        fs.unlink(filepath, err => console.log(err));
    }
};

exports.verifyShop = async (req, res, next) => {
    try{
        const {shopName} = req.body;
        const shop = await Shop.findOne({where:{shopName:shopName}});
        if(!shop)
            throw new Error('this shop does not exists');
        await shop.update({isVerified:true});
        mailer.general_mail(shop.email,shop.name,'shop verification status','you are now a verified seller');
        return res.status(200).json({message:'verified'});
    }
    catch(err){
        if(!err.statusCode)
            err.statusCode=500;
        next(err);
    }
};