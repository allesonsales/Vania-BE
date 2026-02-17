import Endereco from "../../models/Endereco.js";
import Escola from "../../models/Escola.js";

async function buscarEscola(id) {
  try {
    const escola = await Escola.findOne({
      where: { id: id },
      include: { model: Endereco, as: "endereco" },
    });

    return escola;
  } catch (error) {
    throw error;
  }
}

export default buscarEscola;
