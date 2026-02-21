import Escola from "../../models/Escola.js";
import RotaAluno from "../../models/relacoes/RotaAluno.js";
import RotaEscola from "../../models/relacoes/RotaEscola.js";
import Rota from "../../models/Rota.js";

async function consultarNumerosDeAlunosPorEscola(escolaId) {
  try {
    const totalAlunos = await RotaAluno.count({
      include: [
        {
          model: Rota,
          as: "rota",
          include: [
            {
              model: Escola,
              as: "escolas", // aqui é o "as" da belongsToMany
              where: { id: escolaId },
              attributes: [],
            },
          ],
          attributes: [],
        },
      ],
    });

    return totalAlunos;
  } catch (error) {
    throw error;
  }
}

export default consultarNumerosDeAlunosPorEscola;
