import nodemailer from "nodemailer";
import { GMAIL, PASS_GMAIL } from "../utils.js";

const transport = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: GMAIL,
    pass: PASS_GMAIL,
  },
});

export const sendEmail = async (subject, message) => {
  try {
    const info = await transport.sendMail({
      from: "Evelina Niemann <evelinaniemann@gmail.com>",
      to: "evelinaniemann@gmail.com",
      subject: subject,
      html: message,
    });
    console.log("Correo electrónico enviado:", info);
    return info;
  } catch (error) {
    console.error("Error al enviar correo electrónico:", error);
    throw new Error("Error al enviar correo electrónico");
  }
};
