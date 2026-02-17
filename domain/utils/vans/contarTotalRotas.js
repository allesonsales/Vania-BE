import Rota from "../../models/Rota.js";

async function contarTotalRotas(vanId) {
  const totalRotas = await Rota.count({
    where: { van_id: vanId },
  });

  return totalRotas;
}

export default contarTotalRotas;
