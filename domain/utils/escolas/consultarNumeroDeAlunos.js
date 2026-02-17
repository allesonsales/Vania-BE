import RotaAluno from "../../models/relacoes/RotaAluno.js";
import Rota from "../../models/Rota.js";

async function consultarNumerosDeAlunosPorEscola(escolaId) {
  try {
    const totalAlunos = await RotaAluno.count({
      include: { model: Rota, as: "rota", where: { escola_id: escolaId } },
    });

    return totalAlunos;
  } catch (error) {
    throw error;
  }
}

export default consultarNumerosDeAlunosPorEscola;
