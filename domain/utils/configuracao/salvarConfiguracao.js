import Configuracao from "../../models/Configuracoes.js";

async function salvarConfiguracao(
  usuarioId,
  valorMensalidade,
  diaPadraoVencimento,
  tempoContrato,
) {
  try {
    const dadosConfiguracao = {
      usuario_id: usuarioId,
      valor_mensalidade: valorMensalidade,
      dia_padrao_vencimento: diaPadraoVencimento,
      tempo_contrato: tempoContrato,
    };

    const encontrarConfiguracao = await Configuracao.findOne({
      where: { usuario_id: usuarioId },
    });

    if (encontrarConfiguracao) {
      await Configuracao.update(dadosConfiguracao);
    } else {
      const configuracao = await Configuracao.create(dadosConfiguracao);
    }
  } catch (error) {
    throw error;
  }
}

export default salvarConfiguracao;
