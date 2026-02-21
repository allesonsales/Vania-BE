import { Op } from "sequelize";
import Escola from "../../models/Escola.js";
import ModeloVan from "../../models/Modelo.js";
import Motorista from "../../models/Motorista.js";
import RotaEscola from "../../models/relacoes/RotaEscola.js";
import Rota from "../../models/Rota.js";
import Van from "../../models/Van.js";

async function consultarRotasEscolas(usuarioId) {
  try {
    const rotasEncontradas = await RotaEscola.findAll({
      include: [
        {
          model: Rota,
          as: "rota",
          where: { usuario_id: usuarioId, status: { [Op.ne]: 0 } },
          include: [
            { model: Motorista, as: "motorista" },
            { model: Escola, as: "escolas" },
            {
              model: Van,
              as: "van",
              include: [{ model: ModeloVan }],
            },
          ],
        },
      ],
    });

    const flatRotas = () => {
      const rotasMap = new Map();

      rotasEncontradas.forEach((rotaEscola) => {
        const rota = rotaEscola.rota;

        if (!rotasMap.has(rota.id)) {
          rotasMap.set(rota.id, {
            id: rota.id,
            nome: rota.nome,
            hora_inicio_ida: rota.hora_inicio_ida,
            hora_fim_ida: rota.hora_fim_ida,
            hora_inicio_volta: rota.hora_inicio_volta,
            hora_fim_volta: rota.hora_fim_volta,
            status: rota.status,
            motorista: {
              nome: rota.motorista.nome,
              data_nascimento: rota.motorista.data_nascimento,
              cpf: rota.motorista.cpf,
              telefone: rota.motorista.telefone,
              usuario_id: rota.motorista.usuario_id,
              usuario_motorista_id: rota.motorista.usuario_motorista_id,
            },
            van: {
              id: rota.van.id,
              modelo: rota.van.modelo_van.modelo,
              numero: rota.van.numero,
              placa: rota.van.placa,
              renavam: rota.van.renavam,
              ano: rota.van.ano,
            },
            escolas: [],
          });
        }

        const escolaDados = rota.escolas.find(
          (e) => e.id === rotaEscola.escola_id,
        );
        if (escolaDados) {
          rotasMap.get(rota.id).escolas.push({
            id: escolaDados.id,
            nome: escolaDados.nome,
            telefone: escolaDados.telefone,
            tipo: escolaDados.tipo,
            usuario_id: escolaDados.usuario_id,
            status: escolaDados.status,
            horario_previsto: rotaEscola.horario_previsto,
          });
        }
      });

      return Array.from(rotasMap.values());
    };

    return flatRotas();
  } catch (error) {
    console.error(error);
    throw new Error("Erro ao buscar rota escola");
  }
}

export default consultarRotasEscolas;
