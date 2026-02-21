import RotaEscola from "../../models/relacoes/RotaEscola.js";
import Rota from "../../models/Rota.js";

async function consultarNumeroDeRotasAtivasPorEscola(escolaId) {
  const rotas = await RotaEscola.count({ where: { escola_id: escolaId } });

  return rotas;
}

export default consultarNumeroDeRotasAtivasPorEscola;
