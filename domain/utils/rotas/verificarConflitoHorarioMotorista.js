import { Op } from "sequelize";
import Rota from "../../models/Rota.js";

async function verificarConflitoHorarioMotorista(
  motoristaId,
  horaInicioIda,
  horaFimIda,
  horaInicioVolta,
  horaFimVolta,
  rotaIdAtual
) {
  const motoristaEmConflito = await Rota.findOne({
    where: {
      motorista_id: motoristaId,
      status: 1,
      id: { [Op.ne]: rotaIdAtual },
      [Op.or]: [
        {
          hora_inicio_ida: { [Op.lt]: horaFimIda },
          hora_fim_ida: { [Op.gt]: horaInicioIda },
        },
        {
          hora_inicio_volta: { [Op.lt]: horaFimVolta },
          hora_fim_volta: { [Op.gt]: horaInicioVolta },
        },
      ],
    },
  });

  if (!motoristaEmConflito) return null;

  return motoristaEmConflito;
}

export default verificarConflitoHorarioMotorista;
