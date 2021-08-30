var jwt = require('jsonwebtoken');

module.exports = {
    verifyToken: async (req, res, next) => {
        var token = req.headers.authorization;
        try {
            if(token){
                var payload = await jwt.verify(token, process.env.JWTSECRET);
                req.user = payload;
                return next()
             }
             res.status(400).json({error: "Token Required"})
        } catch (error) {
            next(error);
        }
    }
}