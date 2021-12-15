const jwt = require('jsonwebtoken');
const User = require('./models/user')

module.exports = async (req, res, next) => {
    let token = req.headers["authorization"];
    token = token.split(" ")[1];

    jwt.verify(token, "access", async (err, user) => {
        if (user) {
            const id=user.id;
            const userData = await User.findOne({where:{id:id}})
            req.user = userData;
            next();
        } 
        else if (err.message === "jwt expired")
            return res.status(400).json({message: "Access token expired"});
        else 
            return res.status(403).json({message: "User not authenticated" });
    });
};