import { Op } from "sequelize";
import Motorista from "../../models/Motorista.js";

async function consultarMotorista(motoristaId, usuarioId) {
  const motorista = await Motorista.findOne({
    where: { [Op.and]: { id: motoristaId, usuario_id: usuarioId } },
  });

  if (!motorista) return null;

  return motorista;
}

export default consultarMotorista;
