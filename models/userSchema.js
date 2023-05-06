const mongoose = require("mongoose");
const crypto = require("crypto")
const userSchema  = new mongoose.Schema({

    username:{
        type:String,
        required : [true , "please enter your name"]
    },
    email:{
        type:String,
        unique:true,
        required:[true , "Please enter email address"]
    },
    password:{
        type:String,
        required:[true,"please enter password"]
    },
   role:{
    type:String,
    enum :["user" , "admin"],
    default:"user"
   },
   forgotPasswordToken:String,
   forgotPasswordExpiry :Date,
         
},
{
    timestamps:true
})

userSchema.methods = {
    generateForgotPasswordToken:function(){
        const forgotToken = crypto.randomBytes(20).toString('hex');

        this.forgotPasswordToken = crypto.createHash('sha256').update(forgotToken).digest("hex");

        this.forgotPasswordExpiry = Date.now() + 20 + 60 * 1000

        return forgotToken;
    }
}

const User = new mongoose.model("User" , userSchema);
module.exports = User;