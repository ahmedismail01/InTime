const { sendMail } = require("../helpers/nodeMailer");

const htmlMaker = (title, otp, otpLifeSpan) => {
  html = `
  <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
    <div style="margin:50px auto;width:70%;padding:20px 0">
      <div style="border-bottom:1px solid #eee">
        <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">InTime</a>
      </div>
      <p style="font-size:1.1em">Hi,</p>
      <p>Thank you for choosing InTime. Use the following OTP to ${title}. OTP is valid for ${otpLifeSpan} minutes</p>
      <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${otp}</h2>
      <p style="font-size:0.9em;">Regards,<br />InTime</p>
      <hr style="border:none;border-top:1px solid #eee" />
  </div>
</div>
`;
  return html;
};
module.exports = sendEmail = async (reciever, title, otp, otpLifeSpan) => {
  const html = htmlMaker(title, otp, otpLifeSpan);
  await sendMail(reciever, title, html);
};
