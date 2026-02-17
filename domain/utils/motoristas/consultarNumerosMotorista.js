import RotaAluno from "../../models/relacoes/RotaAluno.js";
import Rota from "../../models/Rota.js";
import Viagem from "../../models/Viagem.js";

async function consultarNumerosMotorista(id) {
  console.log("consultar numero motorista");
  const rotas = await Rota.count({
    where: { motorista_id: id },
  });

  const alunos = await RotaAluno.count({
    include: [{ model: Rota, as: "rota", where: { motorista_id: id } }],
  });

  const viagens = await Viagem.count({
    include: [{ model: Rota, as: "rota", where: { motorista_id: id } }],
  });
  const ultima = await Viagem.findOne({
    include: [
      {
        model: Rota,
        as: "rota",
        where: { motorista_id: id },
      },
    ],
    order: [["createdAt", "DESC"]],
  });

  const estatisticasMotorista = {
    quantidade_rotas: rotas,
    quantidade_alunos: alunos,
    quantidade_viagens: viagens,
    ultima_viagem: ultima,
  };

  console.log(estatisticasMotorista);

  return estatisticasMotorista;
}

export default consultarNumerosMotorista;
