const User = require("../models/userSchema")
const jwt = require("jsonwebtoken")
const asyncHandler = require("../services/asyncHandler");
const sendEmail = require("../utils/sendEmail")
const { default: CustomError } = require("../utils/customError");


exports.isLoggedIn = asyncHandler(async(req,res)=>{
    let token;
    if(req.cookies.token || 
        (req.headers.authorization && req.headers.authorization.startsWith("Bearer"))
        ){
            token = req.cookies.token|| req.headers.authorization.split(" ")[1]
    }
    if(!token){
        throw new CustomError("Not authorized to access this route" , 401)
    }

    try {
        const decoded = jwt.verify(token , process.env.TOKEN_SECRET);
        req.user = await User.findById(decoded._id,"name email role")
        next();
        
    } catch (error) {
        throw new CustomError(error.message||"Not authorized to access this route" , 401)
        
    }
})