import nodemailer from "nodemailer"

let transporter = nodemailer.createTransport({
    host: process.env.SMPT_HOST,
    port: process.env.SMPT_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMPT_USER, // generated ethereal user
      pass:process.env.SMPT_PASS, // generated ethereal password
    },
  });


  module.exports = transporter;
