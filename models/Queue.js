const mongoose = require('mongoose');


const queueSchema = mongoose.Schema({
   transactionId : {
    type : mongoose.Types.ObjectId,
    ref : 'Transaction',
    required : true,
    }
},{timestamps:true});

const Queue = mongoose.model('Queue',queueSchema);

module.exports = Queue;