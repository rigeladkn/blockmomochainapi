const mongoose = require('mongoose');

const transactionSchema = mongoose.Schema({
    sender :{ //when in withdraw, Momo marchand phone number
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true,
    },
    receiver : { //when in withdraw, Momo marchand phone number
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true,
    },
    amount : {
        type : Number,
        required : true,
    },
    transactionId : {
        type : String,
        required : true,
    },
    status : { //DEFAULT,DOWNTIME if did in downtown or not
        type : String,
        default : 'DEFAULT',
        required : false,
    },
    type : { //WITHDRAW,TRANSFERT
        type : String,
        required : true,
        default : 'TRANSFERT'
    },
    relaunchedTime : {
        type : Array,
        required : false,
    },
    resolvedStatus : { //RESOLVED,PENDING,FAILED
        type : String,
        required : false,
        default : 'RESOLVED'
    }
},{timestamps:true});

// transactionSchema.pre('save',async function(next){

// });

const Transaction = mongoose.model('Transaction',transactionSchema);

module.exports = Transaction;