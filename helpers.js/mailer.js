const nodemailer = require("nodemailer");
const nodemailersendgrid = require("nodemailer-sendgrid-transport");

const transporter = nodemailer.createTransport(nodemailersendgrid({
    auth:{api_key:process.env.API_KEY}
}));

exports.signup_email=(email,token,name,host) =>{
    transporter.sendMail({
        from: "poolidea1@gmail.com",to: email,
        subject: 'Account Verification Link',
        text: 'Hello '+ name +',\n\n' + 
        'Please verify your account by clicking the link: \nhttp:\/\/' 
        + host + '\/confirmation\/' + email + '\/' + token + '\n\nThank You!\n',
    });
}

exports.forgot_password_email=(email,token,name,host) =>{
    transporter.sendMail({
        from: "poolidea1@gmail.com",to: email,
        subject: 'Account Verification Link',
        text: 'Hello '+ name +',\n\n' + 
        'Please click on the link to change your password: \nhttp:\/\/' 
        + host + '\/changepassword\/' + email + '\/' + token + '\n\nThank You!\n'
    });
}