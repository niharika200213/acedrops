const { validationResult } = require('express-validator');

const imgUrl=require('../models/imgUrl');
const shop = require('../models/shop');
const product = require('../models/product');
const categories = require('../models/categories');
const { Op, Error} = require("sequelize");
const order = require('../models/order');
const order_item = require('../models/order_item');
const cart_item = require('../models/cart_item');
const reviews = require('../models/reviews');
const address = require('../models/address');
const fav = require('../models/fav');

exports.search = async (req, res, next) => {
    try{
        const {toSearch} = req.body;
        const products = await product.findAll({where:{[Op.or]:[
            {title:{[Op.iLike]:`%${toSearch}%`}},
            {description:{[Op.iLike]:`%${toSearch}%`}}
            ]},include:[{model:imgUrl,attributes:['imageUrl']}]});

        const categoryProds = await categories.findAll({where:{category:{[Op.iLike]:`%${toSearch}%`}},
            include:[{model:product,include:[{model:imgUrl,attributes:['imageUrl']}]}]});

        const shops = await shop.findAll({where:{[Op.and]:[{isVerified:true},{[Op.or]:[
            {shopName:{[Op.iLike]:`%${toSearch}%`}},
            {description:{[Op.iLike]:`%${toSearch}%`}}
            ]}]},include:[{model:imgUrl,where:{purpose:"coverPic"},attributes:['imageUrl'],required:false}]
        });
        const favProd = await fav.findAll({where:{userId:req.user.id},attributes:['productId']});
        return res.status(200).json({products,categoryProds,shops,favProd});
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
            err.statusCode=300;
            throw err;   
        }
        const {addressId} = req.body;
        const addr = await address.findOne({where:{[Op.and]:[{id:addressId},{userId:req.user.id}]}});
        if(!addr){
            const err= new Error('add address'); 
            err.statusCode=301;
            throw err;
        }
        const cart = await req.user.getCart();
        if(cart){
            const products = await cart.getProducts();
            if(products.length){
                const userOrder = await req.user.createOrder({price:cart.price,addressId:addr.id});
                await userOrder.addProducts(products.map(prod => {
                    if(prod.stock-prod.cart_item.quantity < 0){
                        let updatedPrice = prod.discountedPrice*(prod.cart_item.quantity-prod.stock);
                        userOrder.increment({price:-updatedPrice});
                        prod.order_item = {quantity:prod.stock};
                    }
                    else
                        prod.order_item = {quantity:prod.cart_item.quantity};
                    prod.increment({stock:-prod.order_item.quantity});
                    return prod;
                }));
                await cart_item.destroy({where:{cartId:cart.id}});
                await cart.destroy();
                await order_item.destroy({where:{quantity:0}});
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
        let {addressId,quantity,prodId} = req.body;
        const addr = await address.findOne({where:{[Op.and]:[{id:addressId},{userId:req.user.id}]}});
        if(!addr){
            const err= new Error('add address'); 
            err.statusCode=402;
            throw err;
        }
        const prod = await product.findByPk(prodId);
        if(prod){
            if(prod.stock === 0){
                const err= new Error('out of stock'); 
                err.statusCode=400;
                throw err;
            }
            if(prod.stock-quantity < 0)
                quantity = prod.stock;
            
            await prod.increment({stock:-quantity});
            const price = prod.discountedPrice*quantity;
            const orderedProd = await req.user.createOrder({price:price,addressId:addr.id});
            await order_item.create({quantity:quantity,orderId:orderedProd.id,productId:prod.id});
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

exports.getOrders = async (req, res, next) => {
    try{
        const orders = await req.user.getOrders({include:[{model:product,include:
            [{model:imgUrl,attributes:['imageUrl']}]}]});
        return res.status(200).send(orders);
    }
    catch(err){
        if(!err.statusCode)
            err.statusCode=500;
        next(err);
    }
};

exports.cancelOrder = async (req, res, next) => {
    try{
        const {orderId} = req.params;
        const orderCancel = await req.user.getOrders({where:{id:orderId}});
        if(orderCancel.length===0){
            const err= new Error('order does not exists'); 
            err.statusCode=400;
            throw err;
        }
        await orderCancel[0].update({status:'cancelled'});
        return res.status(200).send(orderCancel);
    }
    catch(err){
        if(!err.statusCode)
            err.statusCode=500;
        next(err);
    }
};