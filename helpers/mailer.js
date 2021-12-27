const nodemailer = require("nodemailer");
const nodemailersendgrid = require("nodemailer-sendgrid-transport");

const transporter = nodemailer.createTransport(nodemailersendgrid({
    auth:{api_key:process.env.API_KEY}
}));

exports.send_mail=(email,name,otp,text) =>{
    transporter.sendMail({
        from: "eventooze@gmail.com",to: email,
        subject: text,
        text: 'Hello '+ name +',\n\n' + 'your otp is:' + otp + '\n\nThank You!\n',
    });
};

exports.general_mail=(email,name,sub,text)=>{
    transporter.sendMail({
        from: "eventooze@gmail.com",to: email,
        subject: sub,
        text: 'Hello '+ name +',\n\n' +text+ '\n\nThank You!\n',
    });
};