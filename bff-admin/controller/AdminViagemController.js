import Escola from "../../domain/models/Escola.js";
import ModeloVan from "../../domain/models/Modelo.js";
import Motorista from "../../domain/models/Motorista.js";
import Rota from "../../domain/models/Rota.js";
import Van from "../../domain/models/Van.js";
import Viagem from "../../domain/models/Viagem.js";
import consultarViagemPorId from "../../domain/utils/consultarViagemPorId.js";

export class AdminViagemController {
  static async consultarViagensUsuario(req, res) {
    console.log("chamou esse");
    try {
      const usuarioId = req.usuario.id;

      const viagens = await Viagem.findAll({
        where: { usuario_id: usuarioId },
        include: [
          {
            model: Rota,
            as: "rota",
            include: [
              { model: Van, as: "van", include: [{ model: ModeloVan }] },
              { model: Motorista, as: "motorista" },
            ],
          },
        ],
      });

      // const viagemFlat = viagens.map((viagem) => ({
      //   id: viagem.id,
      //   rota_id: viagem.rota_id,
      //   tipo: viagem.tipo,
      //   hora_inicio: viagem.hora_inicio,
      //   hora_fim: viagem.hora_fim,
      //   data: viagem.createdAt,
      //   rota: {
      //     id: viagem.rota.id,
      //     nome: viagem.rota.nome,
      //     hora_inicio_ida: viagem.rota.hora_inicio_ida,
      //     hora_fim_ida: viagem.rota.hora_fim_ida,
      //     hora_inicio_volta: viagem.rota.hora_inicio_vsolta,
      //     hora_fim_volta: viagem.rota.hora_fim_volta,
      //     van: {
      //       id: viagem.rota.van.id,
      //       modelo: viagem.rota.van.modelo_van.modelo,
      //       numero: viagem.rota.van.numero,
      //     },
      //     escola: {
      //       id: viagem.rota.escola.id,
      //       nome: viagem.rota.escola.nome,
      //       telefone: viagem.rota.escola.telefone,
      //       tipo: viagem.rota.escola.tipo,
      //     },
      //     motorista: {
      //       id: viagem.rota.motorista.id,
      //       nome: viagem.rota.motorista.nome,
      //     },
      //   },

      //   // id: 8,
      //   // rota_id: 2,
      //   // tipo: 1,
      //   // hora_inicio: "16:23:24",
      //   // hora_fim: "16:25:29",
      //   // status: 2,
      //   // createdAt: "2026-02-06T19:23:24.000Z",
      //   // updatedAt: "2026-02-06T19:25:29.000Z",
      //   // usuario_id: 2,
      //   // rota: {
      //   //   id: 2,
      //   //   nome: "Parque Alexandre - Antonieta Di Lascio Ozeki",
      //   //   partida_id: 3,
      //   //   van_id: 1,
      //   //   motorista_id: 1,
      //   //   escola_id: 2,
      //   //   hora_inicio_ida: "21:00:00",
      //   //   hora_fim_ida: "22:00:00",
      //   //   hora_inicio_volta: "23:00:00",
      //   //   hora_fim_volta: "23:30:00",
      //   //   usuario_id: 2,
      //   //   status: 1,
      //   //   createdAt: "2026-02-04T18:53:46.000Z",
      //   //   updatedAt: "2026-02-06T19:25:50.000Z",
      //   // },
      // }));

      return res.status(200).json(viagens);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Erro ao consultar viagens!", status: "error" });
    }
  }

  static async consultarViagem(req, res) {
    try {
      const usuarioId = req.usuario.id;
      const viagemId = req.params.id;

      const viagem = await consultarViagemPorId(viagemId);

      if (!viagem) {
        return res
          .status(404)
          .json({ message: "Erro ao buscar viagem!", status: "error" });
      }

      return res.status(200).json(viagem);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Erro ao buscar viagem!", status: "error" });
    }

    return viagem;
  }
}
