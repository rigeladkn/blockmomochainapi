const mongoose = require('mongoose');

    const connectDB = async ()=> {
        try {
            const conn = await mongoose.connect(process.env.DATABASE_URL);
            console.log(`Connected successfully to database at ${conn.connection.host}`);
        } catch (error) {
            console.log(error);
            process.exit(1);
        }
    }

module.exports = {connectDB};