import nodemailer from "nodemailer";
import path from "path";
import TransportStream from "winston-transport";
import PASS_GMAIL from "../utils.js";

const transport = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: "evelinaniemann@gmail.com",
    pass: "hxqjohkqpemzjvon",
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

// sendEmail()
//   .then((res) => console.log(res))
//   .catch((err) => console.log(err.message));
