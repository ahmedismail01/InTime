const nodemailer = require("nodemailer");

exports.sendMail = (reciever, subject, html) => {
  const transporter = nodemailer.createTransport({
    service: "yahoo",
    port: 587,
    secure: false,
    auth: {
      user: process.env.NODEMAILER_EMAIL,
      pass: process.env.NODEMAILER_PASS,
    },
  });
  const info = transporter.sendMail({
    from: `"intime" <${process.env.NODEMAILER_EMAIL}>`,
    to: reciever,
    subject,
    html,
  });
};
