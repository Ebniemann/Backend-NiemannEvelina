import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;

export const SECRETKEY = "Eve123";

export const generaToken = () => {
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
