import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const CHAVE_TOKEN = process.env.CHAVE_TOKEN;

function criarTokenUsuario(usuario) {
  const token = jwt.sign(
    {
      id: usuario.id,
      nome: usuario.nome,
    },
    CHAVE_TOKEN,
    {
      expiresIn: "1h",
    }
  );

  return token;
}

export default criarTokenUsuario;
