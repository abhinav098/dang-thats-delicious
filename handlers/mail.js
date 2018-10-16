const nodeMailer = require('nodemailer');
const pug = require('pug');
const juice = require('juice');
const htmlToText = require('html-to-text');
const promisify = require('es6-promisify');

const transport = nodeMailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth:{
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

const generateHTML = (fileName, options = {}) => {
  const html = pug.renderFile(`${__dirname}/../views/email/${fileName}.pug`, options);
  const inlined = juice(html);
  return inlined;
}

exports.send = async (options) => {
  const html = generateHTML(options.fileName, options);
  const text = htmlToText.fromString(html);
  const mailOptions = {
    from: 'Abhinav Garg <abhinav.g@kiprosh.com>',
    to: options.user.email,
    html,
    text,
    subject: options.subject
  };
  const sendMail = promisify(transport.sendMail, transport);
  return sendMail(mailOptions);
}
