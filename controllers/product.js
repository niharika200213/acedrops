const { validationResult } = require('express-validator');

const imgUrl=require('../models/imgUrl');
const path=require('path');
const fs=require('fs');
const product=require('../models/products');
const product_category=require('../models/product_category');
const Category=require('../models/categories');

const clearImg = imgArray => {
    for(let i=0; i<imgArray.length; ++i){
        var filepath = path.join(__dirname, '../images', imgArray[i]);
        fs.unlink(filepath, err => console.log(err));
    }
};

exports.createProduct = async (req, res, next) => {
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
        if(!shop.isVerified){
            clearImg(req.images);
            throw new Error('please fill application form first');
        }
        const {stock,title,description,price,offers,category} = req.body;
        const prodCategory = await Category.findOne({where:{category:category}});
        if(!prodCategory)
            throw new Error('this category does not exists');
        const newProd = await product.create({stock:stock,title:title,description:description,
            price:price,offers:offers,shopId:shop.id});
        await product_category.create({productId:newProd.id,categoryId:prodCategory.id});
        for(let i=0;i<req.images.length;++i)
            await imgUrl.create({imageUrl:req.images[i],purpose:'product',productId:newProd.id});
        return res.status(200).json({message:'product created'});
    }
    catch(err){
        if(err.name==='SequelizeUniqueConstraintError')
            next(err.errors[0]);
        if(!err.statusCode)
            err.statusCode=500;
        next(err);
    }
};