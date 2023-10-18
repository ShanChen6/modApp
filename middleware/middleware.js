const jwt = require('jsonwebtoken');

const checkLogin = {
    // verifyToken
    verifyToken: (req, res, next) => {
        try {
            const token = req.headers?.authorization.split(' ')[1];
            if (!req.headers.authorization) {
                return res.status(401).json({
                    error: 'You must be logged in'
                });
            }
            const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            req.user = decodedToken
            next();
        } catch {
            res.status(401).json({
                error: 'Invalid request!'
            });
        }
    }
}

module.exports = checkLogin;