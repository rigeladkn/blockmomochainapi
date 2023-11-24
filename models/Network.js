const  mongoose = require("mongoose");

const networkSchema = mongoose.Schema({
    status : {
        type : String,
        default : 'UP' //UP-DOWN
    }
},{
    timestamps : true,
});

const Network = mongoose.model('Network',networkSchema);
module.exports = Network;