import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import winston from "winston";
import { config } from "./config/config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;


// Generate JWT token for password reset
export const generatePasswordResetToken = (email) => {
  const token = jwt.sign({ email }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
  return token;
};

export const generaAuthToken = (usuario) => {
  const token = {
    id: usuario.id,
    nombre: usuario.nombre,
    rol: usuario.rol,
  };

  return jwt.sign(token, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });
};

// Verify JWT token for password reset
export const verifyPasswordResetToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    return decoded; 
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

export const creaHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const validaPassword = (hashedPassword, password) =>
  bcrypt.compareSync(password, hashedPassword);

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
