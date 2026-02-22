import { Op } from "sequelize";
import Usuario from "../../models/Usuario.js";

async function consultarResponsavel(
  nome,
  datanNascimento,
  cpf,
  telefone,
  email,
  transaction,
) {
  try {
    const responsavel = await Usuario.findOne({
      where: {
        [Op.or]: [{ cpf: cpf }, { email: email }],
      },
      transaction,
    });

    if (!responsavel) {
      let dadosUsuario = {
        nome: nome,
        data_nascimento: datanNascimento,
        cpf: cpf,
        telefone: telefone,
        email: email,
        tipo: 3,
        status: 2,
      };

      let responsavelCriado = await Usuario.create(dadosUsuario, {
        transaction,
      });

      return responsavelCriado;
    }

    if (responsavel) {
      if (responsavel.cpf !== cpf) {
        throw new Error("Email já pertence a outro CPF");
      }
      return responsavel;
    }
  } catch (error) {
    throw error;
  }
}

export default consultarResponsavel;
