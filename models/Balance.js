const mongoose = require('mongoose');

const balanceSchema = mongoose.Schema({
    userId : {
        type : mongoose.Types.ObjectId,
        ref : 'User',
        required : true,
    },
    amount : {
        type : Number,
        default : 0,
        required : true,
    }
},{timestamps :true});

const Balance = mongoose.model('Balance',balanceSchema);
module.exports = Balance;