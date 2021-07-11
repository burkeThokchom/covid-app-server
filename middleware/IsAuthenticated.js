const jwt = require('jsonwebtoken');
const appConfig = require('../appConfig');

module.exports = (req, res, next)=>{
    const authorizationHeader = req.get('Authorization'); //geting authorization token from request header
    if(!authorizationHeader){
        req.isAuth = false;
        req.userId = null;
        return next();
    }

    const token = authorizationHeader.split(' ')[1]; //Bearer token.. taking the token only
    if(!token){
        req.isAuth = false;
        req.userId = null;
        return next();
    }
    let decodedToken = null;
    //verifying the token
    try{
        decodedToken = jwt.verify(token, appConfig.privatekey);
    }
    catch(err){
        req.isAuth = false;
        req.userId = null;
        return next();
    }
    req.isAuth = true;
    req.userId = decodedToken.userId;
    next(); //if everything goes smooth the request is forwarded;
}