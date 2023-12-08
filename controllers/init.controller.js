const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const Network = require("../models/Network");
const Queue = require("../models/Queue");
var cron = require('node-cron');
const Transaction = require("../models/Transaction");


const configureNetwork = asyncHandler(async function(req,res){
    const network = await Network.findOne();
    if(network){
        if(req.body.status && ['UP','DOWN'].includes(req.body.status)){
            try {
                network.status = req.body.status;
                if(network.status == 'UP'){
                    await synchroniseTransactions(); 
                }
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

async function synchroniseTransactions(){
    try {
        const queues = await Queue.find();
        console.log(queues);
        cron.schedule('5 * * * * *',  async () => {
            queues.forEach(async (element) => {
                let transact = await Transaction.findOne({_id : element.transactionId});
                console.log(transact);
                await transact.updateOne({resolvedStatus:'RESOLVED'});
                await transact.save();
                const q = await Queue.deleteOne({_id : element._id});
                console.log('Queue transaction' + element._id + 'removed');
    
            });
        }); 
    } catch (error) {
        
    }
  
}

module.exports = {configureNetwork}