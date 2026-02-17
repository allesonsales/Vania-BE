import Usuario from "../../models/Usuario.js";

async function buscarUsuarioPorId(id) {
  try {
    const usuarioEncontrado = await Usuario.findOne({ where: { id: id } });

    return usuarioEncontrado;
  } catch (error) {
    throw error;
  }
}

export default buscarUsuarioPorId;
