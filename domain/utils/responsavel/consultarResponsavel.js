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
      where: { cpf: cpf },
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

      let responsavelCriado = await Usuario.create(dadosUsuario);

      return responsavelCriado;
    }

    return responsavel;
  } catch (error) {
    throw error;
    a;
  }
}

export default consultarResponsavel;
