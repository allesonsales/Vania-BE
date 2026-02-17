import RotaAluno from "../../models/relacoes/RotaAluno.js";

async function buscarMaiorOrdem(rotaId, transaction) {
  const ultimaOrdem = await RotaAluno.max("ordem", {
    where: { rota_id: rotaId },
    transaction,
  });

  return ultimaOrdem;
}

export default buscarMaiorOrdem;
