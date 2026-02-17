import { Model, Op, where } from "sequelize";
import VanUsuario from "../../models/relacoes/VanUsuario.js";
import Van from "../../models/Van.js";
import ModeloVan from "../../models/Modelo.js";
import Viagem from "../../models/Viagem.js";

async function consultarVan(vanId) {
  try {
    console.log("id recebido: ", vanId);
    const vanEncontrada = await Van.findOne({
      include: { model: ModeloVan },
      where: { id: vanId },
    });

    return vanEncontrada;
  } catch (error) {
    throw error;
  }
}

export default consultarVan;
