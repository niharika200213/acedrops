const jwt = require('jsonwebtoken');
const Shop = require('../models/shop');
const User = require('../models/user')

module.exports = async (req, res, next) => {
    try{
        let token = req.headers["authorization"];
        if(!token)
            return res.status(402).json({message: "User not authenticated" });
        token = token.split(" ")[1];

        //verify jwt token

        jwt.verify(token, process.env.JWT_KEY_ACCESS, async (err, user) => {
            try{
                if(user){
                    //if verified then find user or seller

                    const email=user.email;
                    const userData = await User.findOne({where:{email:email}});
                    if(userData)
                    {
                        req.user = userData;
                        req.type = 'user';
                    }
                    else{
                        const shopData = await Shop.findOne({where:{email:email}});
                        if(shopData)
                        {
                            req.user = shopData;
                            req.type = 'shop';
                        }
                        else{
                            const err= new Error('please signup');
                            err.statusCode=400;
                            throw err;
                        }
                    }
                    next();
                } 
                else if (err.message === "jwt expired")
                    return res.status(403).json({message: "Access token expired"});
                else 
                    return res.status(402).json({message: "User not authenticated" });
            }
            catch(err){
                if(!err.statusCode)
                    err.statusCode=500;
                next(err);
            }
        });
    }
    catch(err){
        if(!err.statusCode)
            err.statusCode=500;
        next(err);
    }
};