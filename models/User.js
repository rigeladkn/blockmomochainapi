const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Balance = require('./Balance');


const userSchema = mongoose.Schema({
    firstname : {
        type : String,
        required : true
    },
    lastname : {
        type : String,
        required : true
    },
    phone : {
        type : String,
        required : true,
        unique : true,
        length : 8,
        validate : {
            validator : function (v){
                return v.length == 8;
            },
        message : props => `${props.value} is not a valid phone number!`
        }
    },
    email : {
        type : String,
        required : true,
        unique : true,
    },
    password : {
        type : String,
        required : true,
        minlength : 8
    },
    role : {
        type : String,
        // required : true,
        enum : ['CLIENT', 'MERCHANT','ADMIN'],
        default : 'CLIENT'
    },
    collectionXrefId : {
        type : String,
        required : false
    },
    disbursementXrefId : {
        type : String,
        required : false
    },
    collectionApiKey : {
        type : String,
        required : false
    },
    disbursementApiKey : {
        type : String,
        required : false
    },
    collectionAccessToken : {
        type : String,
        required : false
    },
    disbursementAccessToken : {
        type : String,
        required : false
    },
    // createdAt :{
    //     type : Date,
    //     immutable : true,
    //     default : ()=> Date.now()
    // },
    // updatedAt :{
    //     type : Date,
    //     default : Date.now()
    // },
},{
    timestamps : true
});

userSchema.pre('save',async function (next){
    if(!this.isModified('password')){
        next();
    }
    const salt = bcrypt.genSaltSync(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.checkPassword = async function(password) {
    const check = await bcrypt.compare(password,this.password.trim());
    console.log('PASSWORD CHECK - ' + password);
    console.log('PASSWORD CHECK - ' + this.password);
    console.log('PASSWORD CHECK - ' + check);
    return check;
};

userSchema.methods.findByPhone = async function(phone){
    const user = this.findOne({phone:phone});
    return user;
}

userSchema.methods.getBalance = async function(){
    const balance = await Balance.findOne({userId : this._id});
    return balance.amount;
}

const User = mongoose.model('User',userSchema);

module.exports = User; 