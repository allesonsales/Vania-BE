import Configuracao from "../../models/Configuracoes.js";

async function consultarConfiguracao(usuarioId) {
  try {
    const configuracao = await Configuracao.findOne({
      where: { usuario_id: usuarioId },
    });

    if (!configuracao) {
      return null;
    }

    return configuracao;
  } catch (error) {
    throw error;
  }
}

export default consultarConfiguracao;
