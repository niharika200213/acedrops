const { validationResult } = require('express-validator');
const Sequelize = require('sequelize');

const imgUrl=require('../models/imgUrl');
const product=require('../models/product');
const product_category=require('../models/product_category');
const categories = require('../models/categories');
const shop = require('../models/shop');
const fav = require('../models/fav');
const reviews = require('../models/reviews');
const User = require('../models/user');
const { Op, Error } = require("sequelize");

exports.createProduct = async (req, res, next) => {
    try{
        if(req.type!=="shop"){
            const err= new Error('shop does not exists'); 
            err.statusCode=404;
            throw err;
        }

        //check if shop is fully created

        const shop = req.user;
        if(!shop.isVerified){
            const err= new Error('please fill application form and wait for verification');
            err.statusCode=400;
            throw err;
        }
        const {stock,title,description,basePrice,shortDescription,
            discountedPrice,offers,category,images} = req.body;
        const prodCategory = await categories.findOne({where:{category:category}});

        //check if category of the product is in the list of categories

        if(!prodCategory){
            const err= new Error('this category does not exists');
            err.statusCode=400;
            throw err;
        }

        //create new product with images

        const newProd = await product.create({stock:stock,title:title,description:description,
            basePrice:basePrice,discountedPrice:discountedPrice,shortDescription:shortDescription,
            offers:offers,shopId:shop.id});
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

        //return products category wise belonging to each to category

        const category = await categories.findAll({include:[
            {model:product,include:
                [{model:imgUrl,attributes:['imageUrl']}]}]});
        
        //return 4 shops

        const Shop = await shop.findAll({where:{isVerified:true},
            attributes:['id','shopName','description'],limit:4,
            order:[Sequelize.fn('RANDOM')],include:[{model:imgUrl,
            attributes:['imageUrl'],where:{purpose:'coverPic'},required:false}]});

        //return 4 latest products

        const newArrival = await product.findAll({limit:4,include:[{
            model:imgUrl,attributes:['imageUrl']
        }],order:[['createdAt','DESC']]});

        //if user is logged in return list of favourite products

        const favProd = await fav.findAll({where:{userId:req.user.id},attributes:['productId']});
        return res.status(200).json({category,Shop,newArrival,favProd});
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

        //find products belonging to specified category
      
        const result = await categories.findOne({where:{category:category},include:[
            {model:product,include:
                [{model:imgUrl,attributes:['imageUrl']}]}]});
        
        //if user is logged in return list of favourite products

        const favProd = await fav.findAll({where:{userId:req.user.id},attributes:['productId']});
        return res.status(200).json({result,favProd});
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
        let reviewsAndRatings,userReview,rating,isFav=false;

        //find prod by id

        const prod = await product.findOne({where:{id:prodId},
            include:[{model:imgUrl,attributes:['imageUrl']},
            {model:shop,attributes:['shopName']}]});
        if(prod){

            //return ratings and reviews by other users
            const prodCat = await product_category.findOne({where:{productId:prodId}});
            const category = await categories.findOne({where:{id:prodCat.categoryId},attributes:['category']});

            reviewsAndRatings = await reviews.findAll({where:{[Op.and]:[{productId:prodId},
                {[Op.not]:[{userId:req.user.id}]}]}});
            if(reviewsAndRatings.length>0){
                reviewsAndRatings.forEach(async element => {
                    const user = await User.findByPk(element.userId);
                    element.userId = user.name;
                });
            }

            //return ratings and reviews by logged in user

            userReview = await reviews.findOne({where:{[Op.and]:[{productId:prodId},
                {userId:req.user.id}]}});

            //return average rating of the product

            const count = await reviews.count({where:{rating:{[Op.gt]:0}}});
            const sum = await reviews.sum('rating');
            rating = sum/count;

            //check if this product exists in the logged in user's wishlist

            const favProd = await fav.findOne({where:{[Op.and]:[{productId:prodId},
                {userId:req.user.id}]},attributes:['productId']});
            if(favProd)
                isFav=true;
            return res.status(200).json({prod,category,userReview,reviewsAndRatings,rating,isFav});
        }
        const err= new Error('product not found'); 
        err.statusCode=400;
        throw err;
    }
    catch(err){
        if(!err.statusCode)
            err.statusCode=500;
        next(err);
    }
};

exports.addToCart = async (req, res, next) => {
    try{
        if(req.type==='shop'){
            const err= new Error('seller cannot add to cart'); 
            err.statusCode=400;
            throw err;
        }
        const {prodId} = req.body;
        let prod,newQuantity=1;
        let cart = await req.user.getCart();

        //create cart if it does not exists

        if(!cart)
            cart = await req.user.createCart({price:0});
        const prodInCart = await cart.getProducts({where:{id:prodId}});
        if(prodInCart.length>0)
            prod = prodInCart[0];
        
        //check if the given product already exists in cart and increase its quantity

        if(prod){
            const oldQuantity = prod.cart_item.quantity;
            newQuantity = oldQuantity+1;
            await cart.addProduct(prod,{through:{quantity:newQuantity}});
            await cart.increment({price:prod.discountedPrice});
        }

        //add prod in cart if it does not already exists

        else{
            let prodInDb = await product.findByPk(prodId);
            if(prodInDb){
                await cart.addProduct(prodInDb,{through:{quantity:newQuantity}});
                await cart.increment({price:prodInDb.discountedPrice});
            }
            else{
                const err= new Error('product does not exists'); 
                err.statusCode=400;
                throw err;
            }
        }
        return res.status(200).json({price:cart.price,quantity:newQuantity,prodId:prodId});
    }
    catch(err){
        if(!err.statusCode)
            err.statusCode=500;
        next(err);
    }
};

exports.removeFromCart = async (req, res, next) => {
    try{
        if(req.type==='shop'){
            const err= new Error('seller cannot remove from cart'); 
            err.statusCode=400;
            throw err;
        }
        const {prodId} = req.body;
        let prod,newQuantity=1;
        let cart = await req.user.getCart();

        //check if cart exists

        if(!cart){
            const err= new Error('no products to remove'); 
            err.statusCode=400;
            throw err;
        }

        //check if given product exists in cart

        const prodInCart = await cart.getProducts({where:{id:prodId}});
        if(prodInCart.length>0)
            prod = prodInCart[0];
        if(prod){

            //if product exists decrease its quantity

            const oldQuantity = prod.cart_item.quantity;
            newQuantity = oldQuantity-1;
            await cart.increment({price:-prod.discountedPrice});

            //if quantity becomes 0 then delete prod from cart

            if(newQuantity===0)
                cart.removeProduct(prod);

            //update new quantity and price

            else
                await cart.addProduct(prod,{through:{quantity:newQuantity}});
            return res.status(200).json({price:cart.price,quantity:newQuantity,prodId:prod.id});
        }
        else{
            const err= new Error('no products to remove'); 
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

exports.deleteCartProd = async (req, res, next) => {
    try{
        if(req.type==='shop'){
            const err= new Error('seller cannot remove from cart'); 
            err.statusCode=400;
            throw err;
        }

        //delete prod from cart irrespective of the quantity

        const {prodId} = req.body;
        let prod;
        let cart = await req.user.getCart();

        //check if cart exists

        if(!cart){
            const err= new Error('no products to remove'); 
            err.statusCode=400;
            throw err;
        }

        //check if given product exists in cart

        const prodInCart = await cart.getProducts({where:{id:prodId}});
        if(prodInCart.length>0)
            prod = prodInCart[0];
        if(prod){

            //update cart price and delete product from cart

            const oldQuantity = prod.cart_item.quantity;
            await cart.increment({price:-(prod.discountedPrice*oldQuantity)});
            cart.removeProduct(prod);
            return res.status(200).json({price:cart.price,prodId:prod.id});
        }
        else{
            const err= new Error('no products to remove'); 
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

exports.viewCart = async (req, res, next) => {
    try{
        if(req.type==='shop'){
            const err= new Error('seller cannot view cart'); 
            err.statusCode=400;
            throw err;
        }

        //check if cart exists

        let cart = await req.user.getCart();
        if(!cart){
            const err= new Error('no products in cart'); 
            err.statusCode=400;
            throw err;
        }

        /*return products in cart and favourites lists to check 
        if the given product exists in wishlist also*/

        const prodInCart = await cart.getProducts({include:
            [{model:imgUrl,attributes:['imageUrl']}]});
        const favProd = await fav.findAll({where:{userId:req.user.id},attributes:['productId']});
        return res.status(200).json({prodInCart,favProd});
    }
    catch(err){
        if(!err.statusCode)
            err.statusCode=500;
        next(err);
    }
};

exports.addAndRemFav = async (req, res, next) => {
    try{
        if(req.type==='shop'){
            const err= new Error('seller cannot add to wishlist'); 
            err.statusCode=400;
            throw err;
        }

        //check if prod exists

        const prod = await product.findByPk(req.body.prodId);
        if(prod){

            //if prod exists in wishlist then remove it

            favInDb = await fav.findOne({where:{userId:req.user.id,productId:req.body.prodId}});
            if(favInDb){
                await favInDb.destroy();
                return res.status(200).json({status:'0',prodId:prod.id});
            }

            //if prod does not exists in wishlist then add it

            else{
                await fav.create({userId:req.user.id,productId:req.body.prodId});
                return res.status(200).json({status:'1',prodId:prod.id});
            }
        }
        else{
            const err= new Error('product does not exists'); 
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

exports.viewWishlist = async (req, res, next) => {
    try{
        if(req.type==='shop'){
            const err= new Error('seller cannot view wishlist'); 
            err.statusCode=400;
            throw err;
        }

        //get product ids in wishlist and return products
        
        const result = await fav.findAll({where:{userId:req.user.id},attributes:['productId']});
        const prodIds = result.map((result) => result.productId);
        const prods = await product.findAll({where:{id:{[Op.in]:prodIds}},
            include:[{model:imgUrl,attributes:['imageUrl']}]});
        return res.status(200).json(prods);
    }
    catch(err){
        if(!err.statusCode)
            err.statusCode=500;
        next(err);
    }
};
