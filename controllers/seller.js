const { validationResult } = require('express-validator');

const imgUrl=require('../models/imgUrl');
const shop = require('../models/shop');
const product = require('../models/product');
const { Op, Error } = require("sequelize");

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
        return res.status(200).send(prod);
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
        return res.status(200).send('updated successfully');
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