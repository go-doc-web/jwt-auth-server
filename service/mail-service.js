require("dotenv").config();
const { registrationMailText } = require("../utils");
const nodemailer = require("nodemailer");

const sendActivationMail = async (to, link) => {
  try {
    let transporter = nodemailer.createTransport({
      host: "smtp.meta.ua",
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false, // временное отключение проверки сертификата
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_MAIL,
      to,
      subject: "Важное уведомление",
      text: "",
      html: registrationMailText(link),
    });
  } catch (error) {
    console.error(error);
  }
};

module.exports = { sendActivationMail };
