module.exports.sendEmail = async (Email, subject, text) => {
  try {
    var nodemailer = require("nodemailer");
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "nimishghatiya.sofmen@gmail.com",
        pass: "qezadzlvsoeporlm",
      },
    });
    await transporter.sendMail({
      from: "nimishghatiya.sofmen@gmail.com",
      to: Email,
      subject: subject,
      text: text,
    });
  } catch (err) {
    console.log(err.message, "email not sent");
  }
};
