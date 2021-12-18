const {OAuth2Client} = require('google-auth-library');
const CLIENT_ID = '281941853004-ueqpi7qkb9a8qa7op4aqjl230rolftme.apps.googleusercontent.com';
const client = new OAuth2Client(CLIENT_ID);

module.exports = async (req, res, next) => {
    try{
        const {token} = req.body;
        const user = {};
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,  
        });
        const payload = ticket.getPayload();
        user.name = payload.name;
        user.email = payload.email;
        req.user = user;
    }
    catch(err){
        if(!err.statusCode)
            err.statusCode=500;
        next(err);
    }
};