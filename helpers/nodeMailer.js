const nodemailer = require("nodemailer");

exports.sendMail = (reciever, subject, text, html) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    secure: false,
    auth: {
      user: process.env.NODEMAILER_EMAIL,
      pass: process.env.NODEMAILER_PASS,
    },
  });
  const info = transporter.sendMail({
    from: '"intime" <foo@exmaple.com>',
    to: reciever,
    subject,
    text,
    html,
  });
};
