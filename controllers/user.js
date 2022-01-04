const { validationResult } = require('express-validator');

const imgUrl=require('../models/imgUrl');
const shop = require('../models/shop');
const product = require('../models/product');
const categories = require('../models/categories');
const { Op, Error } = require("sequelize");
const order = require('../models/order');
const order_item = require('../models/order_item');
const reviews = require('../models/reviews');

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
        const {review,rating} = req.body;
        const orders = await order.findAll({where:{userId:req.user.id},attributes:['id']});
        const orderIds = orders.map((result) => result.id);
        const ordered = await order_item.findAll({where:{[Op.and]:[
            {orderId:orderIds},{productId:prodId}]}});
        if(!ordered.length){
            const err= new Error('you can rate or review a product only after buying it'); 
            err.statusCode=400;
            throw err;            
        }
        const alreadyReviewed = await reviews.findOne({where:{[Op.and]:
            [{userId:req.user.id,productId:prodId}]}});
        if(alreadyReviewed)
            await alreadyReviewed.update({review:review,rating:rating});
        else
            await reviews.create({review:review,rating:rating,userId:req.user.id,productId:prodId});
        return res.status(200).send('done');
    }
    catch(err){
        if(!err.statusCode)
            err.statusCode=500;
        next(err);
    }
};