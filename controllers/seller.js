const { validationResult } = require('express-validator');

const imgUrl=require('../models/imgUrl');
const user=require('../models/user');
const order=require('../models/order');
const order_item=require('../models/order_item');
const shop = require('../models/shop');
const product = require('../models/product');
const { Op, Error } = require("sequelize");
const address = require('../models/address');

exports.updateProd = async (req, res, next) => {
    try{
        if(!validationResult(req).isEmpty()){
            const err = new Error(validationResult(req).errors[0].msg);
            err.statusCode=422;
            throw err;
        }
        if(req.type!=='shop'){
            const err = new Error('something went wrong');
            err.statusCode=400;
            throw err;
        }
        const {prodId} = req.params;
        const prod = await product.findByPk(prodId);
        if(!prod){
            const err = new Error('product does not exists');
            err.statusCode=400;
            throw err;
        }
        if(prod.shopId!==req.user.id){
            const err = new Error('you cannot edit this product');
            err.statusCode=400;
            throw err;
        }
        const {stock,title,description,basePrice,discountedPrice,offers} = req.body;
        await prod.update({stock:stock,title:title,description:description,basePrice:basePrice,
            discountedPrice:discountedPrice,offers:offers});
        return res.status(200).json(prod);
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

exports.updateShop = async (req, res, next) => {
    try{
        if(!validationResult(req).isEmpty()){
            const err = new Error(validationResult(req).errors[0].msg);
            err.statusCode=422;
            throw err;
        }
        if(req.type!=='shop'){
            const err = new Error('something went wrong');
            err.statusCode=400;
            throw err;
        }
        const Shop = await shop.findByPk(req.user.id);
        if(!Shop){
            const err = new Error('something went wrong');
            err.statusCode=400;
            throw err;
        }
        const {shopName,noOfMembers,phno,description,address} = req.body;
        await Shop.update({shopName:shopName,noOfMembers:noOfMembers,phno:phno,
            description:description,address:address});
        return res.status(200).json('updated successfully');
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

exports.getProds = async (req, res, next) => {
    try{
        if(req.type!=='shop'){
            const err = new Error('something went wrong');
            err.statusCode=400;
            throw err;
        }
        const prods = await req.user.getProducts({include:[{model:imgUrl,attributes:['imageUrl']}]});
        return res.status(200).json(prods);
    }
    catch(err){
        if(!err.statusCode)
            err.statusCode=500;
        next(err);
    }
};

exports.getOrders = async (req, res, next) => {
    try{
        if(req.type!=='shop'){
            const err = new Error('something went wrong');
            err.statusCode=400;
            throw err;
        }
        const result = await req.user.getProducts({attributes:{exclude:['createdAt','updatedAt']},
            include:[{model:imgUrl,attributes:['imageUrl']},
                {model:order,where:{status:'processing'},attributes:['id'],through:{where:{status:'processing'}},
                include:[{model:address,attributes:{exclude:['createdAt','updatedAt']}}]}]});
        return res.status(200).json(result);
    }
    catch(err){
        if(!err.statusCode)
            err.statusCode=500;
        next(err);
    }
};

exports.getPrevOrders = async (req, res, next) => {
    try{
        if(req.type!=='shop'){
            const err = new Error('something went wrong');
            err.statusCode=400;
            throw err;
        }
        const result = await req.user.getProducts({attributes:{exclude:['createdAt','updatedAt']},
            include:[{model:imgUrl,attributes:['imageUrl']},
                {model:order,where:{status:['delivered','cancelled']},attributes:['id','status'],
                include:[{model:address,attributes:{exclude:['createdAt','updatedAt']}}]}]});
        return res.status(200).json(result);
    }
    catch(err){
        if(!err.statusCode)
            err.statusCode=500;
        next(err);
    }
};

exports.acceptOrder = async (req, res, next) => {
    try{
        if(req.type!=='shop'){
            const err = new Error('something went wrong');
            err.statusCode=400;
            throw err;
        }
        const {order_itemId} = req.body;
        const orderItem = await order_item.findOne({where:{id:order_itemId,status:'processing'}});
        if(!orderItem){
            const err = new Error('something went wrong');
            err.statusCode=400;
            throw err;
        }
        const prod = await product.findByPk(orderItem.productId);
        if(req.user.id!==prod.shopId){
            const err = new Error('you cannot reject this order');
            err.statusCode=400;
            throw err;
        }
        await orderItem.update({status:'accepted'});
        return res.status(200).json('order accepted');
    }
    catch(err){
        if(!err.statusCode)
            err.statusCode=500;
        next(err);
    }
};

exports.rejectOrder = async (req, res, next) => {
    try{
        if(req.type!=='shop'){
            const err = new Error('something went wrong');
            err.statusCode=400;
            throw err;
        }
        const {order_itemId} = req.body;
        const orderItem = await order_item.findOne({where:{id:order_itemId,status:'processing'}});
        if(!orderItem){
            const err = new Error('something went wrong');
            err.statusCode=400;
            throw err;
        }
        const prod = await product.findByPk(orderItem.productId);
        if(req.user.id!==prod.shopId){
            const err = new Error('you cannot accept this order');
            err.statusCode=400;
            throw err;
        }
        await orderItem.update({status:'rejected'});
        return res.status(200).json('order rejected');
    }
    catch(err){
        if(!err.statusCode)
            err.statusCode=500;
        next(err);
    }
};