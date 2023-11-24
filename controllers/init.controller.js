const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const Network = require("../models/Network");


const configureNetwork = asyncHandler(async function(req,res){
    const network = await Network.findOne();
    if(network){
        if(req.body.status && ['UP','DOWN'].includes(req.body.status)){
            try {
                network.status = req.body.status;
                network.save();
                res.status(201).json({
                    success : true,
                    message : `Network status updated to ${network.status}`
                });
            } catch (error) {
                res.status(400);
                throw new Error(error);
            }
        }
        else{
            res.status(400);
            throw new Error('Invalid status or network status already configured');
        }
    }
    else{
        const newNetwork = await Network.create({status:'UP'});
        res.status(201).json({
            success : true,
            message : `Network status updated to ${newNetwork.status}`,
            network : newNetwork
        });
    }
});

module.exports = {configureNetwork}