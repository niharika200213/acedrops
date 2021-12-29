const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);

module.exports = async (req, res, next) => {
    try{
        const {token} = req.body;
        const user = {};
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.CLIENT_ID  
        });
        const payload = ticket.getPayload();
        console.log(payload);
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