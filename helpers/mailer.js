const nodemailer = require("nodemailer");
const nodemailersendgrid = require("nodemailer-sendgrid-transport");

const transporter = nodemailer.createTransport(nodemailersendgrid({
    auth:{api_key:process.env.API_KEY}
}));

exports.send_mail=(email,name,otp,text) =>{
    transporter.sendMail({
        from: "poolidea1@gmail.com",to: email,
        subject: text,
        text: 'Hello '+ name +',\n\n' + 'your otp is:' + otp + '\n\nThank You!\n',
    });
}