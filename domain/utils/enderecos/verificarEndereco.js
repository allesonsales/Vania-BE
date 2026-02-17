import Endereco from "../../models/Endereco.js";
import buscarLatitude from "../buscarLatitude.js";

async function verificarEndereco(endereco) {
  try {
    const { cep, rua, bairro, cidade, estado, numero, latitude, longitude } =
      endereco;
    const enderecoEncontrado = await Endereco.findOne({
      where: { cep: cep, numero: numero },
    });

    if (!enderecoEncontrado) {
      const coordenadas = await buscarLatitude({
        rua,
        bairro,
        cidade,
        estado,
      });

      endereco.longitude = coordenadas.longitude;
      endereco.latitude = coordenadas.latitude;

      const enderecoCriado = await Endereco.create(endereco);
      return enderecoCriado;
    }

    return enderecoEncontrado;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export default verificarEndereco;
