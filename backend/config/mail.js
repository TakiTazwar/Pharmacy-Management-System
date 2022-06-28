const nodemailer = require('nodemailer');

var transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "b7b14a2d69e5ac",
      pass: "66d50b8c5781d0"
    }
  });


const sendMail = async (mailOptions) => {
    try {
        const mail = await transport.sendMail(mailOptions);
        console.log("Email sent: ", mail.response);
    } catch (error) {
        console.log(error);
    }
}

module.exports = sendMail;