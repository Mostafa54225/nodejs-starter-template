const jwt = require('jsonwebtoken');
const { createCustomeError } = require('../errors/custom-error');
const UnathentincatedError = require('../errors/unauthenticated.js');


const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token;
    if(!token) return next(createCustomeError('You are not authinticated', 401));

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if(err) return next(createCustomeError('Token is not valid', 401));
        req.user = decoded;
        next();
    })
}

const verifyUser = (req, res, next) => {
    verifyToken(req, res, () => {
        if(req.user !== undefined && req.user.id === req.params.id) next()
        else throw new UnathentincatedError('You are not authorized to perform this action');
    })
}

const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if(req.user !== undefined && req.user.role === 'admin') next()
        else throw new UnathentincatedError('You are not authorized to perform this action');
    })
}

module.exports = {
    verifyToken,
    verifyUser,
    verifyAdmin
}