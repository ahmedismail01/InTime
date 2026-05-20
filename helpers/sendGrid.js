const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);


exports.sendMail = (reciever, subject, html) => {
  sgMail.send({
    from: `"intime" <${process.env.NODEMAILER_EMAIL}>`,
    to: reciever,
    subject,
    html,
  });
};
