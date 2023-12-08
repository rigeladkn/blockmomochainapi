const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const Transaction = require("../models/Transaction");
const User = require("../models/User");
const Balance = require("../models/Balance");
const Helpers = require('../helpers/Helpers');
const Network = require("../models/Network");
const Queue = require("../models/Queue");
const momocontroller = require('./momo.controller');


// @desc Make a new transaction 
// route POST /api/transactions
// @access PRIVATE
const sendTransaction = asyncHandler(async function(req,res){
    try {
        const {receiver,amount,type} = req.body;
        if(!['TRANSFERT','WITHDRAW'].includes(type)){
           res.status(400);
           throw new Error('Type of transaction not allowed');
        }
        else{
            const transactionId = await Helpers.generateTransactionUuidId();
            // console.log(req.user);
            //get Receiver id
            const receiverUser = await User.findOne({phone : receiver});
            if(receiverUser){
                // console.log(receiverUser);
                let receiverId = receiverUser._id
                // console.log(receiver);
                try {
                    let network = await Network.findOne();
                    const networkStatus = network.status;
                    //verify user has enough balance
                    if(await Helpers.checkUserBalanceIsEnough(type ==  'TRANSFERT' ? req.user._id : receiverId,amount)){
                        //----------------- TRANFERT FOUND ON MOMO ----------------------- 
                         const isSent =  await momocontroller.transfert(req.user,receiverUser,amount,transactionId);
                         console.log('SENT ' + isSent);
                        //----------------------------------------------------------------
                        if(isSent){
                            //proceed transaction if true
                            const transaction = Transaction({
                                sender : type ==  'TRANSFERT' ? req.user._id : receiverId,
                                receiver : type ==  'TRANSFERT' ? receiverId : req.user._id,
                                amount : amount,
                                transactionId : transactionId,
                                status : networkStatus == 'DOWN' ? 'DOWNTIME' : 'DEFAULT',
                                resolvedStatus : networkStatus == 'DOWN' ? 'PENDING' : 'SUCCESS',
                                type : type
                            });
                            transaction.save();

                            //update User balances
                            await Balance.findOneAndUpdate({userId : type ==  'TRANSFERT' ? req.user._id : receiverId }, {$inc:{amount : -amount}});
                            await Balance.findOneAndUpdate({userId : type ==  'TRANSFERT' ? receiverId : req.user._id }, {$inc:{amount : +amount}});

                            //ADD TRANSACTION IN QUEUE IF NETWORK DOWN
                            if(networkStatus == 'DOWN'){
                                const queue = Queue({transactionId : transaction._id});
                                queue.save();
                            }
                            //
                            res.status(201).send({
                                success : true,
                                message : 'Money sent successfully',
                                transaction : transaction,
                            });
                        }
                        else{
                            res.status(400);
                            throw new Error('An error occured transfering amount');
                        }
                    }
                    else{
                        res.status(400).json({
                            success : false,
                            message : "User balance is not enough",
                        });
                    }
                } catch (error) {
                    res.status(500);
                    throw new Error('An error occured' + error);
                } 
            }
            else{
                res.status(400);
                throw new Error('Invalid phone number');
            }
        }
    } catch (error) {
        throw new Error(error);
    }
});

// @desc Get current user transactions 
// route GET /api/transactions
// @access PRIVATE
const getUserTransactions = asyncHandler(async function(req,res){
    const transactions = await Transaction.find({ $or : [{sender : req.user._id },{receiver : req.user._id}]}).sort({"updatedAt" : -1}).populate('sender',['firstname','lastname','phone']).populate('receiver',['firstname','lastname','phone']);
    res.status(200).send({
        success : true,
        message : 'Success getting list of transactions',
        transactions : transactions,
    });
});

const makeWithdraw = asyncHandler(async function(req,res){
    const {phone,amount} = req.body;
        const transactionId = Helpers.generateTransactionUuidId();
        
} )
module.exports = {sendTransaction,getUserTransactions}