import Rota from "../../models/Rota.js";

async function consultarNumeroDeRotasAtivasPorEscola(escolaId) {
  const rotasPorescola = await Rota.count({
    where: { escola_id: escolaId },
  });

  return rotasPorescola;
}

export default consultarNumeroDeRotasAtivasPorEscola;
