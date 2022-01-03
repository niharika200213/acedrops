const { validationResult } = require('express-validator');
const Sequelize = require('sequelize');

const imgUrl=require('../models/imgUrl');
const product=require('../models/product');
const product_category=require('../models/product_category');
const categories = require('../models/categories');
const shop = require('../models/shop');

exports.createProduct = async (req, res, next) => {
    try{
        const cat = await categories.findOne();
        if(!cat)
            await categories.bulkCreate([{category:'jewellery'},{category:'bakery'},{category:'art'}]);
        if(req.type!=="shop"){
            const err= new Error('shop does not exists'); 
            err.statusCode=404;
            throw err;
        }
        const shop = req.user;
        if(!shop.isVerified){
            const err= new Error('please fill application form and wait for verification');
            err.statusCode=400;
            throw err;
        }
        const {stock,title,description,basePrice,discountedPrice,offers,category,images} = req.body;
        const prodCategory = await categories.findOne({where:{category:category}});
        if(!prodCategory){
            const err= new Error('this category does not exists');
            err.statusCode=400;
            throw err;
        }
        const newProd = await product.create({stock:stock,title:title,description:description,
            basePrice:basePrice,discountedPrice:discountedPrice,offers:offers,shopId:shop.id});
        await product_category.create({productId:newProd.id,categoryId:prodCategory.id});
        for(let i=0;i<images.length;++i)
            await newProd.createImgUrl({imageUrl:images[i],purpose:'product',shopId:shop.id});
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

exports.home = async (req, res, next) => {
    try{
        const category = await categories.findAll({include:[
            {model:product,include:
                [{model:imgUrl,attributes:['imageUrl']}]}]});
        const Shop = await shop.findAll({attributes:['id','shopName','description'],limit:4,
                order:[Sequelize.fn('RANDOM')],
            include:[{model:imgUrl,attributes:['imageUrl'],where:{purpose:'coverPic'},required:false}]});
        const newArrival = await product.findAll({limit:4,include:[{
            model:imgUrl,attributes:['imageUrl']
        }],order:[['createdAt','DESC']]});
        return res.status(200).json({category,Shop,newArrival});
    }
    catch(err){
        if(!err.statusCode)
            err.statusCode=500;
        next(err);
    }
};

exports.categoryWise = async (req, res, next) => {
    try{
        let category = req.params.category;
        category = category.trim().toLowerCase();
        const result = await categories.findOne({where:{category:category},include:[
            {model:product,include:
                [{model:imgUrl,attributes:['imageUrl']}]}]});
        return res.status(200).send(result);
    }
    catch(err){
        if(!err.statusCode)
            err.statusCode=500;
        next(err);
    }
};

exports.viewOneProd = async (req, res, next) => {
    try{
        const prodId = req.params.prodId;
        const prod = await product.findOne({where:{id:prodId},
            include:[{model:imgUrl,attributes:['imageUrl']}]});
        return res.status(200).send(prod);
    }
    catch(err){
        if(!err.statusCode)
            err.statusCode=500;
        next(err);
    }
};