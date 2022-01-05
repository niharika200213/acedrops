const { validationResult } = require('express-validator');

const imgUrl=require('../models/imgUrl');
const shop = require('../models/shop');
const product = require('../models/product');
const categories = require('../models/categories');
const { Op, Error } = require("sequelize");
const order = require('../models/order');
const order_item = require('../models/order_item');
const cart_item = require('../models/cart_item');
const reviews = require('../models/reviews');
const address = require('../models/address');

exports.search = async (req, res, next) => {
    try{
        const {toSearch} = req.body;
        const products = await product.findAll({where:{[Op.or]:[
            {title:{[Op.iLike]:`%${toSearch}%`}},
            {description:{[Op.iLike]:`%${toSearch}%`}}
            ]},include:[{model:imgUrl,attributes:['imageUrl']}]});

        const categoryProds = await categories.findAll({where:{category:{[Op.iLike]:`%${toSearch}%`}},
            include:[{model:product,include:[{model:imgUrl,attributes:['imageUrl']}]}]});

        const shops = await shop.findAll({where:{[Op.or]:[
            {shopName:{[Op.iLike]:`%${toSearch}%`}},
            {description:{[Op.iLike]:`%${toSearch}%`}}
            ]},include:[{model:imgUrl,where:{purpose:"coverPic"},attributes:['imageUrl'],required:false}]
        });
        
        return res.status(200).json({products,categoryProds,shops});
    }
    catch(err){
        if(!err.statusCode)
            err.statusCode=500;
        next(err);
    }
};

exports.rate = async (req, res, next) => {
    try{
        if(req.type==='shop'){
            const err= new Error('seller cannot add ratings and reviews'); 
            err.statusCode=400;
            throw err;
        }
        const prodId = req.params.prodId;
        let ordered;
        const {review,rating} = req.body;
        const alreadyReviewed = await reviews.findOne({where:{[Op.and]:
            [{userId:req.user.id,productId:prodId}]}});
        if(alreadyReviewed){
            await alreadyReviewed.update({review:review,rating:rating});
            return res.status(200).send('done');
        }
        const orders = await order.findAll({where:{userId:req.user.id},attributes:['id']});
        if(orders.length>0){
            const orderIds = orders.map((result) => result.id);
            ordered = await order_item.findAll({where:{[Op.and]:[
                {orderId:orderIds},{productId:prodId}]}});
        }
        else{
            const err= new Error('you can rate or review a product only after buying it'); 
            err.statusCode=400;
            throw err; 
        }
        if(!ordered.length){
            const err= new Error('you can rate or review a product only after buying it'); 
            err.statusCode=400;
            throw err;            
        }        
        else{
            await reviews.create({review:review,rating:rating,userId:req.user.id,productId:prodId});
            return res.status(200).send('done');
        }
    }
    catch(err){
        if(!err.statusCode)
            err.statusCode=500;
        next(err);
    }
};

exports.addAddress = async (req, res, next) => {
    try{
        const {houseNo,streetOrPlotNo,locality,city,state} = req.body;
        await req.user.createAddress({houseNo:houseNo,streetOrPlotNo:streetOrPlotNo,
            locality:locality,city:city,state:state});
        return res.status(200).send('information updated');
    }
    catch(err){
        if(!err.statusCode)
            err.statusCode=500;
        next(err);
    }
};

exports.addPhno = async (req, res, next) => {
    try{
        const {phno} = req.body;
        await req.user.update({phno:phno});
        return res.status(200).send('information updated');
    }
    catch(err){
        if(!err.statusCode)
            err.statusCode=500;
        next(err);
    }
};

exports.getAddress = async (req, res, next) => {
    try{
        const addresses = await req.user.getAddresses();
        return res.status(200).send(addresses);
    }
    catch(err){
        if(!err.statusCode)
            err.statusCode=500;
        next(err);
    }
};

exports.orderCart = async (req, res, next) => {
    try{
        if(!req.user.phno){
            const err= new Error('add phone number'); 
            err.statusCode=401;
            throw err;   
        }
        const {addressId} = req.body;
        const addr = await address.findOne({where:{[Op.and]:[{id:addressId},{userId:req.user.id}]}});
        if(!addr){
            const err= new Error('add address'); 
            err.statusCode=402;
            throw err;
        }
        const cart = await req.user.getCart();
        if(cart){
            const products = await cart.getProducts();
            if(products.length){
                const userOrder = await req.user.createOrder({price:cart.price,addressId:addr.id});
                await userOrder.addProducts(products.map(prod => {
                    prod.order_item = {quantity:prod.cart_item.quantity};
                    return prod;
                }));
                await cart_item.destroy({where:{cartId:cart.id}});
                await cart.destroy();
                return res.status(200).send('order placed');
            }
        }
        const err= new Error('something went wrong'); 
        err.statusCode=400;
        throw err;
    }
    catch(err){
        if(!err.statusCode)
            err.statusCode=500;
        next(err);
    }
};

exports.orderProd = async (req, res, next) => {
    try{
        if(!req.user.phno){
            const err= new Error('add phone number'); 
            err.statusCode=401;
            throw err;   
        }
        const {addressId,quantity,prodId} = req.body;
        const addr = await address.findOne({where:{[Op.and]:[{id:addressId},{userId:req.user.id}]}});
        if(!addr){
            const err= new Error('add address'); 
            err.statusCode=402;
            throw err;
        }
        const prod = await product.findByPk(prodId);
        if(prod){
            await req.user.createOrder({price:prod.price*quantity,addressId:addr.id});
            prod.order_item = {quantity:quantity};
            return res.status(200).send('order placed');
        }
        const err= new Error('something went wrong'); 
        err.statusCode=400;
        throw err;
    }
    catch(err){
        if(!err.statusCode)
            err.statusCode=500;
        next(err);
    }
};