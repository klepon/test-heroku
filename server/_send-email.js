'use strict';
const nodemailer = require('nodemailer');

module.exports = (from, to, subject, message, plaintext) => {
  let transporter = nodemailer.createTransport({
    service: 'mail.ojual.com',
    host: 'us3.clientdomainmanager.org',
    port: 465,
    secure: true,
    auth: {
        user: 'noreplay@ojual.com',
        pass: 'mkoPOI1q'
    }
    // host: 'smtp.gmail.com',
    // port: 465,
    // secure: true, // use SSL
    // auth: {
    //     user: 'anggajasaseo@gmail.com',
    //     pass: 'xdrUJM7#$%'
    // }
  });

  transporter.verify(function(error, success) {
   if (error) {
        console.log(error);
   // } else {
   //      console.log('Server is ready to take our messages');
   }
});

  // setup email data with unicode symbols
  let mailOptions = {
      from: `"noreplay" <${from}>`, // sender address
      to: to.join(', '), // list of receivers
      subject: subject, // Subject line
      text: plaintext, // plain text body
      html: message // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      // console.log('Message sent: %s', info.messageId);
  });
}
