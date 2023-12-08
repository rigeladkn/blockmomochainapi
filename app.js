const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended : true}));

// const bodyParser = require('body-parser');
const cors = require('cors');
app.use(cors());
app.options('*',cors());
const morgan = require('morgan');
app.use(morgan('dev'));
//import middlewares
const errorMiddleware = require("./middlewares/errorMiddleware");



//Import routes
const userRoute = require('./routes/users');
const authRoute = require('./routes/auth');
const transactionRoute = require('./routes/transactions');
const networkRoute = require('./routes/network');
const balanceRoute = require('./routes/balances');
const notifRoute = require('./routes/notifications');


app.get('/',(req,res) => {
    return res.send({
        'success' : true,
        'message' : 'Welcome to BlockMomoChain API'
    });
});


app.use('/api/users',userRoute);
app.use('/api/auth',authRoute);
app.use('/api/transactions',transactionRoute);
app.use('/api/network',networkRoute);
app.use('/api/balances',balanceRoute);
app.use('/api/notif',notifRoute);


app.use(errorMiddleware.errorHandler);
app.use(errorMiddleware.notFound);
module.exports = app;