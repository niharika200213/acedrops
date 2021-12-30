const { validationResult } = require('express-validator');

const imgUrl=require('../models/imgUrl');
const path=require('path');
const fs=require('fs');
const product=require('../models/product');
const product_category=require('../models/product_category');
const categories = require('../models/categories');

const clearImg = imgArray => {
    for(let i=0; i<imgArray.length; ++i){
        var filepath = path.join(__dirname, '../images', imgArray[i]);
        fs.unlink(filepath, err => console.log(err));
    }
};

exports.createProduct = async (req, res, next) => {
    try{
        await categories.bulkCreate([{category:'jewellery'},{category:'bakery'},{category:'art'}],
            {ignoreDuplicates:true});
        if(!validationResult(req).isEmpty()){
            clearImg(req.images);
            const err = new Error(validationResult(req).errors[0].msg);
            err.statusCode=422;
            throw err;
        }
        if(req.type!=="shop"){
            clearImg(req.images);
            const err= new Error('shop does not exists'); 
            err.statusCode=404;
            throw err;
        }
        const shop = req.user;
        if(!shop.isVerified){
            clearImg(req.images);
            const err= new Error('please fill application form and wait for verification');
            err.statusCode=400;
            throw err;
        }
        const {stock,title,description,price,offers,category} = req.body;
        const prodCategory = await categories.findOne({where:{category:category}});
        if(!prodCategory){
            clearImg(req.images);
            const err= new Error('this category does not exists');
            err.statusCode=400;
            throw err;
        }
        const newProd = await product.create({stock:stock,title:title,description:description,
            price:price,offers:offers,shopId:shop.id});
        await product_category.create({productId:newProd.id,categoryId:prodCategory.id});
        for(let i=0;i<req.images.length;++i)
            await imgUrl.create({imageUrl:req.images[i],purpose:'product',productId:newProd.id,shopId:shop.id});
        return res.status(200).json({message:'product created'});
    }
    catch(err){
        if(err.name==='SequelizeUniqueConstraintError'||err.name==='SequelizeValidationError')
            next(err.errors[0]);
        if(!err.statusCode)
            err.statusCode=500;
        next(err);
    }
};

exports.getAllProducts = async (req, res, next) => {
    try{
        let prods={},prodArray=new Array();
        const products = await product.findAll({raw:true});
        for(let i=0;i<products.length;++i){
            const images = await imgUrl.findAll({where:{productId:products[i].id},raw:true});
            const categoryId = await product_category.findOne({where:{productId:products[i].id},
                attributes:['categoryId'],raw:true});
            console.log(categoryId.categoryId)
            const category = await categories.findOne({where:{id:categoryId.categoryId},
                attributes:['category'],raw:true});
            console.log(category.category)
            prods.product=products[i];
            prods.images=images;
            prods.category=category.category;
            prodArray.push(JSON.parse(JSON.stringify(prods)));
        }
        return res.status(200).json(prodArray);
    }
    catch(err){
        if(!err.statusCode)
            err.statusCode=500;
        next(err);
    }
};