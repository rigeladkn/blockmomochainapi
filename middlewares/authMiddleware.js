const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const checkAuthenticated =  asyncHandler(
    async function(req,res,next){

    try {
        let token = req.header('authorization').split(' ')[1] || req.body.token ;
        if(token){
            try {
                const decoded = await jwt.verify(token,process.env.JWT_SECRET);
                // console.log(decoded);
                const user = await User.findById(decoded.userId).select('-password -__v');//hide password
                // console.log(user);
                req.user = user;
                next();   
            } catch (error) {
                res.status(401);
                throw new Error('Unauthorized, invalid token');
            }
           
        }
        else{
            res.status(401);
            throw new Error('Unauthorized, no token');
        }
    } catch (error) {
        res.status(401);
        throw new Error('Unauthorized, no token');
    } 
    }
);
 

module.exports = {checkAuthenticated}