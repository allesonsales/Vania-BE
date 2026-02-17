import { Op, Sequelize } from "sequelize";
import Rota from "../../domain/models/Rota.js";
import Endereco from "../../domain/models/Endereco.js";
import Escola from "../../domain/models/Escola.js";
import Motorista from "../../domain/models/Motorista.js";
import Viagem from "../../domain/models/Viagem.js";
import RotaAluno from "../../domain/models/relacoes/RotaAluno.js";
import Aluno from "../../domain/models/Aluno.js";
import Presenca from "../../domain/models/Presenca.js";

export class viagemController {
  static async verificarViagemAtiva(req, res) {
    try {
      const usuarioId = req.usuario.id;

      const viagem = await Viagem.findOne({
        where: { usuario_id: usuarioId, status: 1 },
      });

      return res.status(200).json(viagem);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Erro ao verificar viagem ativa!", status: "error" });
    }
  }

  static async consultarViagensDisponiveis(req, res) {
    try {
      const usuarioId = req.usuario.id;
      const motorista = await Motorista.findOne({
        where: { usuario_motorista_id: usuarioId },
      });

      if (!motorista) {
        return res
          .status(404)
          .json({ message: "Motorista não encontrado!", status: "error" });
      }
      const agora = new Date();
      const umaHoraAntes = new Date(agora.getTime() - 60 * 60 * 1000);
      const umaHoraDepois = new Date(agora.getTime() + 30 * 60 * 1000);
      const horaAntes = umaHoraAntes.toTimeString().slice(0, 8);
      const horaDepois = umaHoraDepois.toTimeString().slice(0, 8);

      const inicioDoDia = new Date();
      inicioDoDia.setHours(0, 0, 0, 0);

      const fimDoDia = new Date();
      fimDoDia.setHours(23, 59, 59, 999);

      const rotas = await Rota.findAll({
        where: {
          motorista_id: motorista.id,

          [Op.or]: [
            { hora_inicio_ida: { [Op.between]: [horaAntes, horaDepois] } },
            { hora_inicio_volta: { [Op.between]: [horaAntes, horaDepois] } },
          ],

          status: { [Op.ne]: 2 },

          id: {
            [Op.notIn]: Sequelize.literal(`(
            SELECT rota_id 
            FROM viagems 
            WHERE createdAt BETWEEN '${inicioDoDia.toISOString()}' 
            AND '${fimDoDia.toISOString()}'
          )`),
          },
        },
        include: [{ model: Endereco, as: "endereco" }],
      });

      return res.status(200).json(rotas);
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Erro ao consultar viagens disponiveis",
        status: "error",
      });
    }
  }

  static async selecionarViagem(req, res) {
    try {
      const rotaId = req.params.id;

      const rota = await Rota.findOne({
        where: { id: rotaId },
        include: [
          {
            model: Escola,
            as: "escola",
          },
        ],
      });

      if (!rota) {
        return res.status(400).json({ message: "Erro ao consultar rota!" });
      }

      const alunos = await RotaAluno.findAll({
        where: { rota_id: rota.id },
        include: [
          {
            model: Aluno,
            as: "aluno",
          },
        ],
      });

      const viagemFlat = {
        rota_id: rota.id,
        nome_rota: rota.nome,
        hora_inicio_ida: rota.hora_inicio_ida,
        hora_fim_ida: rota.hora_fim_ida,
        hora_fim_volta: rota.hora_fim_volta,
        hora_inicio_volta: rota.hora_inicio_volta,
        alunos: alunos.map((aluno) => ({
          id: aluno.aluno.id,
          nome: aluno.aluno.nome,
          presenca: null,
        })),
      };

      return res.status(200).json(viagemFlat);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Erro ao consultar viagem!" });
    }
  }

  static async iniciarViagem(req, res) {
    try {
      const usuarioId = req.usuario.id;
      const rotaId = req.params.id;
      const horaAtual = new Date().toTimeString().slice(0, 8);

      const rota = await Rota.findOne({
        where: { id: rotaId },
        include: [
          {
            model: Motorista,
            as: "motorista",
          },
        ],
      });

      if (rota.status === 2) {
        return res
          .status(401)
          .json({ message: "Viagem já iniciada!", status: "error" });
      }

      if (!rota) {
        return res
          .status(404)
          .json({ message: "Rota não encontrada", status: "error" });
      }

      rota.update({ status: 2 });

      const viagem = await Viagem.create({
        usuario_id: usuarioId,
        rota_id: rotaId,
        tipo: horaAtual < rota.hora_fim_ida ? 1 : 2,
        status: 1,
        hora_inicio: horaAtual,
      });

      return res.status(200).json({
        message: `Viagem iniciada, boa viagem ${rota.motorista.nome}!`,
        status: "success",
        viagem_id: viagem.id,
        rota_id: rota.id,
      });
    } catch (error) {
      console.error(error);
      return res
        .status(400)
        .json({ message: "Erro ao iniciar viagem", status: "error" });
    }
  }

  static async finalizarViagem(req, res) {
    try {
      const { rotaId, viagemId, alunos } = req.body;
      console.log(rotaId, viagemId, alunos);
      const horaAtual = new Date().toTimeString().slice(0, 8);

      await Rota.update({ status: 1 }, { where: { id: rotaId } });

      await Viagem.update(
        { status: 2, hora_fim: horaAtual },
        { where: { id: viagemId } },
      );

      for (let aluno of alunos) {
        await Presenca.create({
          viagem_id: viagemId,
          aluno_id: aluno.id,
          presenca: aluno.presenca,
        });
      }

      return res.status(200).json({
        message: `Viagem finalizada com sucesso!`,
        status: "success",
      });
    } catch (error) {
      console.error(error);
      return res
        .status(400)
        .json({ message: "Erro ao finalizar viagem", status: "error" });
    }
  }
}
