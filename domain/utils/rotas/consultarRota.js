import Endereco from "../../models/Endereco.js";
import Escola from "../../models/Escola.js";
import ModeloVan from "../../models/Modelo.js";
import Motorista from "../../models/Motorista.js";
import Rota from "../../models/Rota.js";
import Van from "../../models/Van.js";

async function consultarRota(rotaId) {
  console.log("chamou esse");
  try {
    const rota = await Rota.findOne({
      where: { id: rotaId },
      include: [
        { model: Escola, as: "escolas" },
        {
          model: Van,
          as: "van",
          include: { model: ModeloVan },
        },
        { model: Motorista, as: "motorista" },
        { model: Endereco, as: "endereco" },
      ],
    });

    const rotaFlat = {
      id: rota.id,
      nome: rota.nome,
      hora_inicio_ida: rota.hora_inicio_ida,
      hora_fim_ida: rota.hora_fim_ida,
      hora_inicio_volta: rota.hora_inicio_volta,
      hora_fim_volta: rota.hora_fim_volta,
      escolas: rota.escolas.map((escola) => ({
        id: escola.id,
        nome: escola.nome,
        telefone: escola.telefone,
        tipo: escola.tipo,
      })),
      motorista: {
        id: rota.motorista.id,
        nome: rota.motorista.nome,
        data_nascimento: rota.motorista.data_nascimento,
        telefone: rota.motorista.telefone,
        cnh: rota.motorista.cnh,
        data_validade_cnh: rota.motorista.data_validade_cnh,
        tipo_sanguineo: rota.motorista.tipo_sanguineo,
      },
      van: {
        id: rota.van.id,
        numero: rota.van.numero,
        ano: rota.van.ano,
        placa: rota.van.placa,
        renavam: rota.van.renavam,
        modelo: rota.van.modelo_van.modelo,
        lugares: rota.van.lugares,
      },
      endereco: {
        id: rota.endereco.id,
        cep: rota.endereco.cep,
        rua: rota.endereco.rua,
        numero: rota.endereco.numero,
        bairro: rota.endereco.bairro,
        cidade: rota.endereco.cidade,
        estado: rota.endereco.estado,
      },
    };

    if (!rota) return null;

    return rotaFlat;
  } catch (error) {
    throw error;
  }
}

export default consultarRota;
