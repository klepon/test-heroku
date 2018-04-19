'use strict';
const nodemailer = require('nodemailer');
const auth = require('./_static-auth.js');

module.exports = (from, to, subject, message, plaintext) => {
  let transporter = nodemailer.createTransport(auth.cpanel);

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
