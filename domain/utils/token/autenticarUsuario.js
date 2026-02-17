import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const CHAVE_TOKEN = process.env.CHAVE_TOKEN;

function autenticarUsuario(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res
      .status(401)
      .json({ message: "Token não informado!", status: "error" });
  }

  try {
    const decoded = jwt.verify(token, CHAVE_TOKEN);
    req.usuario = decoded;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Token inválido ou expirado!", status: "error" });
  }
}

export default autenticarUsuario;
