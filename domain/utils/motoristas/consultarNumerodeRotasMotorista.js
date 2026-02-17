import Rota from "../../models/Rota.js";

async function consultarNumeroDeRotasMotorista(motoristaId) {
  try {
    const numeroRotas = await Rota.count({
      where: { motorista_id: motoristaId },
    });

    return numeroRotas;
  } catch (error) {
    throw error;
  }
}

export default consultarNumeroDeRotasMotorista;
