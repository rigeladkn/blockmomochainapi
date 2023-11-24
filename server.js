const http = require('http');
const app = require('./app');
require('dotenv').config();
const config = require('./config/db');
 

const server = http.createServer(app);

server.listen(process.env.PORT,()=>{
   console.log('API started on port ' + process.env.PORT);
});
 
//connection to database 
config.connectDB();
// const db = mongoose.connection;
// db.on('error',(error) => console.log(error));
// db.once('open',()=>console.log('Connected successfully to database'));

module.exports = server; 