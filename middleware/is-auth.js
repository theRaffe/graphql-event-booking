const jwt = require('jsonwebtoken');
module.exports = (req, res, next) => {
    req.isAuth = false;
    const authHeader = req.get('Authorization') || '';
    const token = authHeader.replace('Bearer ', '');
    if (token && token === '') {
        console.error('print fail authHeader:', authHeader);
        return next();
    }

    try {
        const decodedToken = jwt.verify(token, 'supersecretpassword');
        if (!decodedToken) {
            return next();
        }

        req.isAuth = true;
        req.userId = decodedToken.userId;
        console.log('print sucess:', req);
        next();
    } catch (err) {
        console.error('print fail decoded:', err);
        return next();
    }

}