'use strict';
const nodemailer = require('nodemailer');

// client id
// 519865629989-0dphb4tg00nhjvgiucjov31dvt4cgvt7.apps.googleusercontent.com
// clinet secret
// _27M9oxlf4vqpVIOlo1QxFyg
next here, it not working :(
module.exports = (from, to, subject, message, plaintext) => {
  let transporter = nodemailer.createTransport({
      // service: 'gmail',
      // secure: 465, // true for 465, false for other ports
      // auth: {
      //     user: 'bugs1945@gmail.com', // generated ethereal user
      //     pass: 'xdrUJM7#$%' // generated ethereal password
      // }
    service: 'Gmail',
    auth: {
      type: 'OAuth2',
      user: 'bugs1945@gmail.com',
      clientId: '519865629989-0dphb4tg00nhjvgiucjov31dvt4cgvt7.apps.googleusercontent.com',
      clientSecret: '_27M9oxlf4vqpVIOlo1QxFyg',
      refreshToken: '1/XXxXxsss-xxxXXXXXxXxx0XXXxxXXx0x00xxx',
      accessToken: 'ya29.Xx_XX0xxxxx-xX0X0XxXXxXxXXXxX0x',
      expires: 1484314697598
    }
  });

  // setup email data with unicode symbols
  let mailOptions = {
      from: `"Fred Foo 👻" <${from}>`, // sender address
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
      console.log('Message sent: %s', info.messageId);
      // Preview only available when sending through an Ethereal account
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
      // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  });
}
