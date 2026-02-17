import Aluno from "../models/Aluno.js";
import ModeloVan from "../models/Modelo.js";
import Motorista from "../models/Motorista.js";
import Presenca from "../models/Presenca.js";
import Rota from "../models/Rota.js";
import Van from "../models/Van.js";
import Viagem from "../models/Viagem.js";

async function consultarViagemPorId(viagemId) {
  try {
    const viagem = await Viagem.findOne({
      where: { id: viagemId },
      include: [
        {
          model: Presenca,
          as: "presenca",
          include: [{ model: Aluno, as: "aluno" }],
        },
        {
          model: Rota,
          as: "rota",
          include: [
            { model: Motorista, as: "motorista" },
            {
              model: Van,
              as: "van",
              include: [{ model: ModeloVan }],
            },
          ],
        },
      ],
    });

    const viagemFlat = {
      id: viagem?.id,
      data: viagem?.createdAt,
      hora_inicio: viagem?.hora_inicio,
      hora_fim: viagem?.hora_fim,
      rota: {
        nome: viagem?.rota?.nome,
        hora_inicio_ida: viagem?.rota?.hora_inicio_ida,
        hora_fim_ida: viagem?.rota?.hora_fim_ida,
        hora_inicio_volta: viagem?.rota?.hora_inicio_volta,
        hora_fim_volta: viagem?.rota?.hora_fim_volta,
        van: viagem?.rota?.van
          ? {
              id: viagem.rota.van.id,
              numero: viagem.rota.van.numero,
              modelo: viagem.rota.van.modelo_van?.modelo,
              placa: viagem.rota.van.placa,
            }
          : null,
        motorista: viagem?.rota?.motorista
          ? {
              id: viagem.rota.motorista.id,
              nome: viagem.rota.motorista.nome,
            }
          : null,
      },
      alunos:
        viagem?.presenca?.map((presenca) => ({
          aluno_id: presenca.aluno?.id ?? null,
          nome: presenca.aluno?.nome ?? "Aluno desconhecido",
          presenca: presenca.presenca,
        })) ?? [],
    };

    return viagemFlat;
  } catch (error) {
    console.error(error);
    throw new Error("Erro ao buscar viagem!");
  }
}

export default consultarViagemPorId;
