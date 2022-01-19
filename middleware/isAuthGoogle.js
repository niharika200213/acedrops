const {OAuth2Client} = require('google-auth-library');
const clientUser = new OAuth2Client(process.env.CLIENT_ID_USER);
const clientShop = new OAuth2Client(process.env.CLIENT_ID_SHOP);

module.exports = async (req, res, next) => {
    try{
        const {token,isShop} = req.body;
        let user = {};
        let ticket;
        if(isShop){
            //verify google token for seller

            ticket = await clientShop.verifyIdToken({
                idToken: token,
                audience: process.env.CLIENT_ID_SHOP 
            });
        }
        else{
            //verify google token for user

            ticket = await clientUser.verifyIdToken({
                idToken: token,
                audience: process.env.CLIENT_ID_USER 
            });
        }
        const payload = ticket.getPayload();
        user.name = payload.name;
        user.email = payload.email;
        user.googleId = payload.sub;
        req.user = user;
        next();
    }
    catch(err){
        if(!err.statusCode)
            err.statusCode=500;
        next(err);
    }
};