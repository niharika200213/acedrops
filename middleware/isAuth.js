const jwt = require('jsonwebtoken');
const Shop = require('../models/shop');
const User = require('./models/user')

module.exports = async (req, res, next) => {
    try{
        let token = req.headers["authorization"];
        token = token.split(" ")[1];

        jwt.verify(token, process.env.JWT_KEY_ACCESS, async (err, user) => {
            if (user) {
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
                    else
                        throw new Error('please signup');
                }
                next();
            } 
            else if (err.message === "jwt expired")
                return res.status(400).json({message: "Access token expired"});
            else 
                return res.status(403).json({message: "User not authenticated" });
        });
    }
    catch(err){
        if(!err.statusCode)
            err.statusCode=500;
        next(err);
    }
};