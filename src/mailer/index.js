import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: process.env.GMAIL_EMAIL,
    pass: process.env.GMAIL_PASSWORD,
  },
});

console.log({
  user: process.env.GMAIL_EMAIL,
  pass: process.env.GMAIL_PASSWORD,
})


export const sendEmail = async ({ to = "evelinaniemann@gmail.com", from = "Evelina Niemann <evelinaniemann@gmail.com>", subject, message }) => {
  try {
    const info = await transport.sendMail({
      from,
      to,
      subject,
      html: message,
    });
    console.log("Correo electrónico enviado:", info);
    return info;
  } catch (error) {
    console.error("Error al enviar correo electrónico:", error);
    throw new Error("Error al enviar correo electrónico");
  }
};