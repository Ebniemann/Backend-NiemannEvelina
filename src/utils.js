import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import winston from "winston";
import { config } from "./config/config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;

export const SECRETKEY = "Eve123";

export const PASS_GMAIL = "hxqjohkqpemzjvon";
export const GMAIL = "evelinaniemann@gmail.com";

export const generaToken = (usuario) => {
  const payload = {
    id: usuario.id,
    nombre: usuario.nombre,
    rol: usuario.rol,
  };

  return jwt.sign(payload, SECRETKEY, { expiresIn: "1h" });
};

export const creaHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const validaPassword = (usuario, password) =>
  bcrypt.compareSync(password, usuario.password);

const loggerDesarrollo = winston.createLogger({
  transports: [
    new winston.transports.Console({
      level: "debug",
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.simple()
      ),
    }),
  ],
});

const loggerProduccion = winston.createLogger({
  transports: [
    new winston.transports.Console({
      level: "info",
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.simple()
      ),
    }),
    new winston.transports.File({
      level: "error",
      filename: "./logs/errorLogs.log",
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
    }),
  ],
});

const LogDesarollo = (req, res, next) => {
  req.logger = loggerDesarrollo;
  next();
};

const LogProduccion = (req, res, next) => {
  req.logger = loggerProduccion;
  next();
};
export { LogDesarollo, LogProduccion };

export const loggerMiddleware =
  config.MODE === "development" ? LogDesarollo : LogProduccion;
