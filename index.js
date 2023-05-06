const dotenv = require("dotenv");

dotenv.config({
    path:'./config/.env'
});

const express  = require("express");
const connectDB = require("./config/db");
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const { json } = require("express");
const cookieParser = require("cookie-parser");
const cors = require('cors');
const morgan = require('morgan');
const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cors());

app.use(morgan('tiny'));
const user = require("./routes/userRoute")
//routes
app.use(passport.initialize());
app.use(passport.session());
    
app.use("/api/v1" , user);


app.get("/" , (req,res)=>{
    res.send("welcome to ecommerce website");
})


app.listen(process.env.PORT , function(req,res){
    console.log("app is listening at port" ,process.env.PORT);
})