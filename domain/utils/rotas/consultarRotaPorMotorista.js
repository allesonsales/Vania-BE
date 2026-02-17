import Motorista from "../../models/Motorista";
import Rota from "../../models/Rota";

async function consultarRotaPorMotorista(motoristaId) {
  const rotas = await Rota.findAll({
    where: { motorista_id: motoristaId },
    include: [{ model: Motorista, as: "motorista" }],
  });

  return rotas;
}
