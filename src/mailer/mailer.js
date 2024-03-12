import nodemailer from "nodemailer";
import TransportStream from "winston-transport";
// import PASS_GMAIL from "../utils.js";

const gmail = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: "evelinaniemann@gmail.com",
    pass: "hxqj ohkq pemz jvon",
  },
});

const enviarEmail = (to, subject, message) => {
  return gmail.sendMail({
    // from: "Evelina Niemann evelinaniemann@gmail.com",
    // to: "evelinaniemann@gmail.com",
    // subject: "Prueba - Desde mi código",
    // html: `
    // <h2 style="color:red">Restablecer clave</h2>
    // <img src='cid:adjunto' width='200'>
    // <p>Puede reestablecer su clave desde el siguiente link</p>
    // <a>LINK</a>
    // `,

    // attachments: {
    //   path: "../imagenes/clave.jpeg",
    //   filename: "recuperoClave.jpeg",
    //   cid: "adjunto",
    // },

    to,
    subject,
    html: message,
  });
};

// enviarEmail()
//   .then((res) => console.log(res))
//   .catch((err) => console.log(err.message));
