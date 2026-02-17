import RotaAluno from "../../models/relacoes/RotaAluno.js";
import Rota from "../../models/Rota.js";

async function contarTotalAlunos(vanId) {
  const total = await RotaAluno.count({
    include: [{ model: Rota, as: "rota", where: { van_id: vanId, status: 1 } }],
  });

  return total;
}

export default contarTotalAlunos;
