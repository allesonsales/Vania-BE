import { Op } from "sequelize";
import Escola from "../../models/Escola.js";
import Motorista from "../../models/Motorista.js";
import Rota from "../../models/Rota.js";
import Van from "../../models/Van.js";
import ModeloVan from "../../models/Modelo.js";

async function consultarRotas(usuarioId) {
  const rotasEncontradas = await Rota.findAll({
    where: {
      usuario_id: usuarioId,
      status: {
        [Op.ne]: 0,
      },
    },
    include: [
      { model: Escola, as: "escola" },
      { model: Van, as: "van", include: [{ model: ModeloVan }] },
      { model: Motorista, as: "motorista" },
    ],
  });

  const rotaFlat = rotasEncontradas.map((rota) => ({
    id: rota.id,
    nome: rota.nome,
    hora_inicio_ida: rota.hora_inicio_ida,
    hora_fim_ida: rota.hora_fim_ida,
    hora_inicio_volta: rota.hora_inicio_volta,
    hora_fim_volta: rota.hora_fim_volta,
    status: rota.status,
    escola: {
      id: rota.escola.id,
      tipo: rota.escola.tipo,
      nome: rota.escola.nome,
      telefone: rota.escola.telefone,
      status: rota.escola.status,
    },
    motorista: {
      id: rota.motorista.id,
      nome: rota.motorista.nome,
      data_nascimento: rota.motorista.data_nascimento,
      telefone: rota.motorista.telefone,
      cnh: rota.motorista.cnh,
      data_validade_cnh: rota.motorista.data_validade_cnh,
    },
    van: {
      id: rota.van.id,
      numero: rota.van.numero,
      ano: rota.van.ano,
      placa: rota.van.placa,
      renavam: rota.van.renavam,
      modelo: rota.van.modelo_van.modelo,
    },
  }));

  return rotaFlat;
}

export default consultarRotas;
