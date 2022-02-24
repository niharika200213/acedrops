const { validationResult } = require('express-validator');

const imgUrl=require('../models/imgUrl');
const order=require('../models/order');
const order_item=require('../models/order_item');
const shop = require('../models/shop');
const product = require('../models/product');
const { Op, Error } = require("sequelize");
const address = require('../models/address');

exports.updateShop = async (req, res, next) => {
    try{
        if(!validationResult(req).isEmpty()){
            const err = new Error(validationResult(req).errors[0].msg);
            err.statusCode=422;
            throw err;
        }
        
        //check if user is a seller

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

        //update information of shop

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

        //return all products of a specific shop

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

        //return all products which were ordered by someone with address and quantity

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

        //return accepted or rejected products

        const result = await req.user.getProducts({attributes:{exclude:['createdAt','updatedAt']},
            include:[{model:imgUrl,attributes:['imageUrl']},
                {model:order,attributes:['id','status'],through:{where:{status:['accepted','rejected']}},
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

        //find the order item

        const orderItem = await order_item.findOne({where:{id:order_itemId,status:'processing'}});
        if(!orderItem){
            const err = new Error('something went wrong');
            err.statusCode=400;
            throw err;
        }
        const prod = await product.findByPk(orderItem.productId);

        //check if the current seller owns this product

        if(req.user.id!==prod.shopId){
            const err = new Error('you cannot reject this order');
            err.statusCode=400;
            throw err;
        }

        //update status to accepted

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
        
        //find the order item

        const {order_itemId} = req.body;
        const orderItem = await order_item.findOne({where:{id:order_itemId,status:'processing'}});
        if(!orderItem){
            const err = new Error('something went wrong');
            err.statusCode=400;
            throw err;
        }
        const prod = await product.findByPk(orderItem.productId);
        
        //check if the current seller owns this product

        if(req.user.id!==prod.shopId){
            const err = new Error('you cannot accept this order');
            err.statusCode=400;
            throw err;
        }
        
        //update status to rejected

        await orderItem.update({status:'rejected'});
        return res.status(200).json('order rejected');
    }
    catch(err){
        if(!err.statusCode)
            err.statusCode=500;
        next(err);
    }
};