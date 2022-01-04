const { validationResult } = require('express-validator');

const imgUrl=require('../models/imgUrl');
const shop = require('../models/shop');
const product = require('../models/product');
const categories = require('../models/categories');
const { Op, Error } = require("sequelize");

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