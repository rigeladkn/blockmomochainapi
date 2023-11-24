const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const Balance = require("../models/Balance");

const getUserBalance = asyncHandler(async function(req,res){
    const userId = req.params.userId;
    const balance = await Balance.findOne({userId: userId}).populate('userId');
    if(balance){
        res.status(200).json({
            success : true,
            message : 'Balance of user ' + balance.userId.firstname + ' ' + balance.userId.lastname,
            balance : balance.amount
        });
    }
    else{
        res.status(400);
        throw new Error('Identifier not found');
    }
});

module.exports={getUserBalance}