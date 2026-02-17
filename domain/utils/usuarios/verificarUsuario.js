import { Op } from "sequelize";
import Usuario from "../../models/Usuario.js";

async function verificarUsuario(cpf, email, telefone) {
  const usuario = await Usuario.findOne({
    where: {
      [Op.or]: [{ cpf: cpf }, { email: email }, { telefone: telefone }],
    },
  });

  if (!usuario) return null;

  return usuario;
}

export default verificarUsuario;
