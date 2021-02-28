const nodemailer = require('nodemailer');

module.exports  = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "d95d3249399eaf",
      pass: "0b0281bb345c34"
    }
  });