import Pagamento from "../../models/Pagamento.js";
import Rota from "../../models/Rota.js";
import RotaAluno from "../../models/relacoes/RotaAluno.js";
import AlunoResponsavel from "../../models/relacoes/AlunoResponsavel.js";
import { Op, fn, col } from "sequelize";
import Usuario from "../../models/Usuario.js";

async function calcularTotalEntradaVan(vanId) {
  const total = await Pagamento.findOne({
    attributes: [[fn("SUM", col("Pagamento.valor")), "total"]],
    include: [
      {
        model: Usuario,
        as: "responsavel",
        required: true,
        include: [
          {
            model: AlunoResponsavel,
            required: true,
            include: [
              {
                model: RotaAluno,
                required: true,
                include: [
                  {
                    model: Rota,
                    required: true,
                    where: { van_id: vanId, status: 1 },
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
    where: {
      status: 1,
    },
    raw: true,
  });

  return total?.total || 0;
}

export default calcularTotalEntradaVan;
