const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const Network = require("../models/Network");


const getNetworkStatus = asyncHandler(async function(req,res){
    const network = await Network.findOne();
    if(network){
        res.status(200).json({
            success : true,
            message : `Success getting network status`,
            status : network.status
        });
    }
    else{
        res.status(500).json({
            success : false,
            message : `Network not yet init`,
        });
    }
});

module.exports = {getNetworkStatus}