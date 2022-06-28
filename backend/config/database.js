const mongoose = require('mongoose');

const dbConnect = async (callback)=>{
    try {
        const client = await mongoose.connect(process.env.DATABASE_URI);
        if(client)
        {
            console.log("Mongoose is Connected");
        }
        callback();
    } catch (error) {
        throw new Error(error.message);
    }
}


module.exports = dbConnect;