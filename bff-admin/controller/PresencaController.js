import Presenca from "../../domain/models/Presenca.js";

export class PresencaController {
  static async verificarPresencas(req, res) {
    const viagemId = req.body.viagemId;

    if (!viagemId) return null;

    const presencas = await Presenca.findAll({
      where: { viagem_id: viagemId },
    });

    if (presencas.length === 0) {
      return res.status(404).json({
        message: "Nenhuma presença foi marcada nessa viagem...",
      });
    }

    return res.status(200).json(presencas);
  }

  static async verificarPresencasPorAluno(req, res) {
    const alunoId = req.body.alunoId;

    if (!alunoId) return null;

    const presencasDoAluno = await Presenca.findAll({
      where: { aluno_id: alunoId },
    });

    if (presencasDoAluno.length === 0) {
      return res.status(404).json({ message: "Nenhim" });
    }

    return res.status(200).json(presencasDoAluno);
  }
}
