const mongoose = require("mongoose");
mongoose.set('strictQuery' ,false);
const connectDB = mongoose.connect('mongodb://127.0.0.1:27017/ecommerceDB');
console.log("connected to mongoDB succesfully" , process.env.PORT);

module.exports = connectDB;
