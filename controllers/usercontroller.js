const User = require("../models/userSchema");
const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
var jwt = require('jsonwebtoken');
const asyncHandler = require("../services/asyncHandler");
const sendEmail = require("../utils/sendEmail")
const { default: CustomError } = require("../utils/customError");
const crypto = require("crypto")

   const cookieOptions = {
    expires:new Date(Date.now() + 3 * 24 * 60 *60 *1000),
    httpOnly:true
  }
  // passport.use(User.createStrategy());

  passport.use(new LocalStrategy(
    function(username, password, done) {
      User.findOne({email }, function(err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false); }
        bcrypt.compare(password, user.password, function(err, res) {
          if (res) {
            return done(null, user);
          } else {
            return done(null, false);
          }
        });
      });
    }
  ));

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser((id, done) => {
    User.findById(id);
  });


  
//Register User using Passport js


exports.register = async (req,res) =>{
    try {
      const {username,email, password} = req.body;
      if(!username  || !email ||!password){
        return res.status(400).json({
          success:false,
          message:"please enter all fields"
        });
      }

      const newUser = await User.findOne({email});
      if(newUser) return res.status(400).json({
          success:false,
          message:"User already exists"
      });
        if(!newUser){
          const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const user = new User({
        username , email,
        password: hashedPassword
     });
     user.save() ;
    return   res.status(200).json({
                  success:true,
                  message:`"${user.username}" your account has been created`,
                  user
                });
        }

    } catch (error) {
      res.status(500).json({
        success:false,
        message:error.message
      })
    }
}


//Login User using passport
exports.login=async(req,res)=>{
  try {
    const { email, password } = req.body;

    // Check if a user with the given email exists in the database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'User not found',
      });
    }

    // Compare the provided password with the hashed password stored in the database
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(400).json({
        success: false,
        message: 'Incorrect password',
      });
    }

    // Create a session for the user
    req.login(user, (err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      const accessToken =  jwt.sign(
				JSON.stringify(user),
				process.env.TOKEN_SECRET
			);
      return  res.status(200).cookie("accessToken", accessToken,cookieOptions).json({
        success: false,
        message: `Welcome back ${user.username}`,
        accessToken
      });;
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}


//logout
exports.logout = asyncHandler(async(_req,res)=>{
        res.cookie('accessToken', null , {
          expires:new Date(Date.now()),
          httpOnly:true
        });

        res.status(200).json({
          success:true,
          message:"Logged Out successfully"
        })
})


exports.forgotPassword = asyncHandler(async(req,res)=>{
     const {email} = req.body;
     if(!email){
      throw new CustomError('please enter email' , 404)
     }
     const user = await User.findOne({email});
     if(!user){
      throw new CustomError('user not found' , 404)
     }

     const resetToken = user.generateForgotPasswordToken();
     await user.save({
      validateBeforeSave:false
     });

     const resetUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset${resetToken}`


     const text = `your password reset url is \n\n ${resetUrl} \n\n`
     try {
      await sendEmail({
        email:user.email ,
        subject: "Password reset for ecommerce" ,
        text:text
      })
      res.status(200).json({
        success:true,
        message:`email send to ${user.email}`
      })
     } catch (error) {
      //roll back - clear fields and save
      user.forgotPasswordToken = undefined
      user.forgotPasswordExpiry= undefined

      await user.save({validateBeforeSave:false})
      throw new CustomError(err.message || "fail to send Email" , 500)

      
     }
});

exports.resetPassword = asyncHandler
(async(req,res)=>{
    const {token : resetToken} = req.params
    const{password , confirmPassword} = req.body
   const resetPasswordToken =  crypto.createHash('sha256')
    .update(resetToken).digest('hex')

    const user =  await User.findOne({forotPasswordToken:resetPasswordToken,
    forgotPasswordExpiry:{
      $gt:Date.now()
    }
    
    })

    
    if(!user){
      throw new CustomError('Password token is invalid or expired' , 400) 
    }

    if(password !== confirmPassword){
      throw new CustomError('password does not match' , 400)
    }

    user.password = password
    user.forgotPasswordToken = undefined
    user.forgotPasswordExpiry = undefined
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);
    const resetUser = new User({
      password: hashedPassword
   });

    await user.save()
    const token = user.getJwtToken()
    user.password = undefined

    res.cookie("token"  , token , cookieOptions)
    res.status(200).json({
      success:true,
      user
    })
})