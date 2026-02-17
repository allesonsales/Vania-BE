import dotenv from "dotenv";

dotenv.config();

async function buscarLatitude(endereco) {
  const { rua, bairro, cidade } = endereco;
  const enderecoCompleto = `${rua}, ${bairro}, ${cidade}, Brasil`;

  const url = `https://photon.komoot.io/api?q=${encodeURIComponent(
    enderecoCompleto
  )}`;

  try {
    const res = await fetch(url, { headers: { "User-Agent": "MeuApp/1.0" } });
    const data = await res.json();

    console.log("json dada", JSON.stringify(data));

    const coord = data.features[0].geometry.coordinates;

    if (data.features.length > 0) {
      console.log("dados coordenadas", data);
      return {
        longitude: coord[0],
        latitude: coord[1],
      };
    } else {
      console.log("CEP não encontrado");
      console.log("dados coordenadas", data);
      return null;
    }
  } catch (err) {
    console.log("Erro ao buscar cordenadas", err);
    return null;
  }
}

export default buscarLatitude;
