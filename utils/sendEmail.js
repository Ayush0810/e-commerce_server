import transporter from "../services/nodemailer";

let sendEmail =async(options)=>{
    const message = {
    from: process.env.EMAIL, // sender address
    to: options.email, // list of receivers
    subject: options.subject, // Subject line
    text: options.text, // plain text body
    // html: "<b>Hello world?</b>", // html body
  }
  await transporter.sendMail(message)
  
};


module.exports = sendEmail;