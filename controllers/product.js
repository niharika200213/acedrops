const { validationResult } = require('express-validator');

const imgUrl=require('../models/imgUrl');
const product=require('../models/product');
const product_category=require('../models/product_category');
const categories = require('../models/categories');

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
        const {stock,title,description,price,offers,category,images} = req.body;
        const prodCategory = await categories.findOne({where:{category:category}});
        if(!prodCategory){
            const err= new Error('this category does not exists');
            err.statusCode=400;
            throw err;
        }
        const newProd = await product.create({stock:stock,title:title,description:description,
            price:price,offers:offers,shopId:shop.id});
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

exports.getAllProducts = async (req, res, next) => {
    try{
        let prods={},prodArray=new Array();
        const products = await product.findAll({raw:true});
        for(let i=0;i<products.length;++i){
            const images = await imgUrl.findAll({where:{productId:products[i].id},raw:true});
            const categoryId = await product_category.findOne({where:{productId:products[i].id},
                attributes:['categoryId'],raw:true});
            const category = await categories.findOne({where:{id:categoryId.categoryId},
                attributes:['category'],raw:true});
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

exports.home = async (req, res, next) => {
    try{
        let response = {}, products = {}, final = new Array();
        const category = await categories.findAll({raw:true});
        for(let i=0;i<category.length;++i){
            const productId = await product_category.findAll({where:{categoryId:category[i].id},
                attributes:['productId'],raw:true,limit:4});
            response.category=category[i].category;
            response.products=new Array();
            for(let j=0;j<productId.length;++j){
                const prod = await product.findOne({where:{id:productId[j].productId},raw:true});
                products.product = prod;
                const images = await imgUrl.findAll({where:{productId:prod.id},raw:true});
                products.images = images;
                response.products.push(JSON.parse(JSON.stringify(products)));
            }
            final.push(JSON.parse(JSON.stringify(response)));
        }
        
        return res.status(200).json(final);
    }
    catch(err){
        if(!err.statusCode)
            err.statusCode=500;
        next(err);
    }
};