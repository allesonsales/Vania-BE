import { Op } from "sequelize";
import ModeloVan from "../../models/Modelo.js";
import VanUsuario from "../../models/relacoes/VanUsuario.js";
import Van from "../../models/Van.js";

async function consultarVans(usuarioId) {
  try {
    const vansEncontradas = await Van.findAll({
      where: { status: { [Op.ne]: 0 } },
      include: [
        { model: VanUsuario, where: { usuario_id: usuarioId }, attributes: [] },
        { model: ModeloVan },
      ],
    });

    return vansEncontradas;
  } catch (error) {
    throw error;
  }
}

export default consultarVans;
