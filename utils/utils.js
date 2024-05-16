import nodemailer from "nodemailer";

export async function sendMessage(sub, txt) {
  let transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: parseInt(process.env.MAIL_PORT, 10),
    secure: process.env.MAIL_SECURE === 'true', // true for 465, false for other ports
    auth: {
        type: process.env.MAIL_AUTH_TYPE,
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD
    },
    tls: {
        rejectUnauthorized: process.env.MAIL_TLS === 'true'
    }
});

  let message = {
    from: process.env.MESSAGE_FROM,
    to: process.env.MESSAGE_TO,
    subject: sub,
    text: txt,
  };

  await transporter
    .sendMail(message)
    .then(() => {
      console.log("Message sent");
    })
    .catch((err) => {
      console.log("Message not sent - " + err);
    });
}
