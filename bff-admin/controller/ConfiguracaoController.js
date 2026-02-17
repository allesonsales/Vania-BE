import salvarConfiguracao from "../../domain/utils/configuracao/salvarConfiguracao.js";

export class ConfiguracaoController {
  static async criarConfiguracao(req, res) {
    const usuarioId = req.usuario.id;
    const { valorMensalidade, tempoContrato, diaPadraoVencimento } = req.body;

    try {
      await salvarConfiguracao(
        usuarioId,
        valorMensalidade,
        diaPadraoVencimento,
        tempoContrato,
      );
      return res.status(200).json({ mesage: "Configurações salvas!" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erro ao salvar configurações" });
    }
  }

  static async editarConfiguracao(req, res) {}
}
