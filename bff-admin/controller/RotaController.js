import { Op } from "sequelize";
import Rota from "../../domain/models/Rota.js";
import consultarRotas from "../../domain/utils/rotas/consultarRotas.js";
import verificarCampos from "../../domain/utils/verificarCampos.js";
import verificarEndereco from "../../domain/utils/enderecos/verificarEndereco.js";
import buscarEscola from "../../domain/utils/escolas/buscarEscola.js";
import consultarRota from "../../domain/utils/rotas/consultarRota.js";
import verificarConflitoHorarioMotorista from "../../domain/utils/rotas/verificarConflitoHorarioMotorista.js";
import verificarHorario from "../../domain/utils/rotas/verificarHorario.js";
import RotaAluno from "../../domain/models/relacoes/RotaAluno.js";
import Motorista from "../../domain/models/Motorista.js";
import RotaEscola from "../../domain/models/relacoes/RotaEscola.js";
import sequelize from "../../conn/db.js";
import consultarRotasEscolas from "../../domain/utils/rotas/consultarRotas2.js";
import Viagem from "../../domain/models/Viagem.js";

export class RotaController {
  static async cadastrarRota(req, res) {
    const transaction = await sequelize.transaction();

    try {
      const usuarioId = req.usuario.id;

      const {
        vanId,
        motoristaId,
        escolas,
        cep,
        rua,
        numero,
        bairro,
        cidade,
        estado,
        horaInicioIda,
        horaInicioVolta,
        horaFimIda,
        horaFimVolta,
      } = req.body;

      console.log(escolas);

      const camposObrigatorios = {
        vanId,
        motoristaId,
        horaInicioIda,
        horaInicioVolta,
        horaFimIda,
        horaFimVolta,
        cep,
        rua,
        numero,
        bairro,
        cidade,
        estado,
      };

      if (!escolas || escolas.length == 0) {
        return res.status(400).json({
          message: "A rota precisa ter pelo menos uma escola!",
          status: "error",
        });
      }

      const motorista = await Motorista.findOne({
        where: { usuario_motorista_id: motoristaId },
      });

      if (!motorista) {
        return res.status(400).json({
          message: "Motorista informado não existe!",
          status: "error",
        });
      }

      const resultadoHorario = await verificarHorario(
        horaInicioIda,
        horaFimIda,
        horaInicioVolta,
        horaFimVolta,
      );

      if (!resultadoHorario.valido) {
        return res.status(400).json({ message: resultadoHorario.message });
      }

      try {
        verificarCampos(camposObrigatorios);
      } catch (error) {
        console.error(error);
        return res.status(400).json({ message: error.message });
      }

      const endereco = {
        cep: cep,
        rua: rua,
        numero: numero,
        bairro: bairro,
        cidade: cidade,
        estado: estado,
        longitude: null,
        latitude: null,
      };

      let enderecoBuscado;

      try {
        enderecoBuscado = await verificarEndereco(endereco);
      } catch (error) {
        console.error(error);
        return res
          .status(400)
          .json({ message: "Erro ao verificar endereço!", status: "error" });
      }

      const dadosRota = {
        nome: `${enderecoBuscado.bairro} -> ${escolas.map((escola) => escola.nome).join(", ")}`,
        van_id: vanId,
        partida_id: enderecoBuscado.id,
        motorista_id: motorista.id,
        hora_inicio_ida: horaInicioIda,
        hora_fim_ida: horaFimIda,
        hora_inicio_volta: horaInicioVolta,
        hora_fim_volta: horaFimVolta,
        usuario_id: usuarioId,
        status: 1,
      };

      console.log(dadosRota);

      const rotaDuplicada = await Rota.findOne({
        where: {
          van_id: vanId,
          motorista_id: motorista.id,
          partida_id: enderecoBuscado.id,
          hora_inicio_ida: horaInicioIda,
          hora_fim_ida: horaFimIda,
          hora_inicio_volta: horaInicioVolta,
          hora_fim_volta: horaFimVolta,
          status: { [Op.eq]: 1 },
        },
      });

      if (rotaDuplicada) {
        return res.status(409).json({ message: "Rota já existente!" });
      }

      const vanEmConflito = await Rota.findOne({
        where: {
          van_id: vanId,
          status: 1,
          [Op.or]: [
            {
              hora_inicio_ida: { [Op.lt]: horaFimIda },
              hora_fim_ida: { [Op.gt]: horaInicioIda },
            },
            {
              hora_inicio_volta: { [Op.lt]: horaFimVolta },
              hora_fim_volta: { [Op.gt]: horaInicioVolta },
            },
          ],
        },
      });

      if (vanEmConflito) {
        return res.status(409).json({
          message: "A van já está em uso nesse horário!",
          status: "error",
        });
      }

      const motoristaEmConflito = await Rota.findOne({
        where: {
          motorista_id: motoristaId,
          status: 1,
          [Op.or]: [
            {
              hora_inicio_ida: { [Op.lt]: horaFimIda },
              hora_fim_ida: { [Op.gt]: horaInicioIda },
            },
            {
              hora_inicio_volta: { [Op.lt]: horaFimVolta },
              hora_fim_volta: { [Op.gt]: horaInicioVolta },
            },
          ],
        },
      });

      if (motoristaEmConflito) {
        return res.status(409).json({
          message: "O motorista já está em outra rota nesse horário",
          status: "error",
        });
      }

      const rota = await Rota.create(dadosRota, { transaction });

      function formatarTempo(tempo) {
        return tempo.length === 5 ? tempo + ":00" : tempo;
      }

      await RotaEscola.bulkCreate(
        escolas.map((escola) => ({
          rota_id: Number(rota.id),
          escola_id: escola.id,
          horario_previsto: formatarTempo(escola.horaPrevisao),
        })),
        { transaction },
      );

      transaction.commit();

      return res
        .status(201)
        .json({ message: "Rota cadastrada com sucesso!", status: "success" });
    } catch (error) {
      transaction.rollback();
      console.error(error);
      return res
        .status(400)
        .json({ message: "Erro ao cadastrar rota!", status: "error" });
    }
  }

  static async buscarRotas(req, res) {
    try {
      const usuarioId = req.usuario.id;
      let rotas;

      // try {
      //   rotas = await consultarRotas(usuarioId);
      // } catch (error) {
      //   console.error(error);
      // }

      try {
        rotas = await consultarRotasEscolas(usuarioId);
      } catch (error) {
        console.error(error);
      }

      return res.status(200).json(rotas);
    } catch (error) {
      console.error(error);
      return res.status(5).json({ essage: "Erro ao buscar rotas.." });
    }
  }

  static async buscarRota(req, res) {
    try {
      const { rotaId } = req.params;
      const usuarioId = req.usuario.id;

      const rota = await consultarRota(rotaId, usuarioId);

      if (rota === null) {
        return res
          .status(200)
          .json({ message: "Rota não encontrada", status: "error" });
      }

      return res.status(200).json(rota);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Erro ao buscar rota!", status: "error" });
    }
  }

  static async editarRota(req, res) {
    const { rotaId } = req.params;
    const usuarioId = req.usuario.id;

    const {
      nome,
      escolaId,
      vanId,
      motoristaId,
      horaInicioIda,
      horaFimIda,
      horaInicioVolta,
      horaFimVolta,
      cep,
      rua,
      numero,
      bairro,
      cidade,
      estado,
    } = req.body;

    const endereco = {
      cep,
      rua,
      numero,
      bairro,
      cidade,
      estado,
    };

    const resultadoHorario = await verificarHorario(
      horaInicioIda,
      horaFimIda,
      horaInicioVolta,
      horaFimVolta,
    );

    if (!resultadoHorario.valido) {
      return res.status(400).json({ message: resultadoHorario.message });
    }

    let enderecoBuscado;

    try {
      enderecoBuscado = await verificarEndereco(endereco);
    } catch (error) {
      console.error(error);
      return res.status(400).json({ message: "Erro ao verificar endereço!" });
    }

    let motoristaEmConflitoHorario;

    try {
      motoristaEmConflitoHorario = await verificarConflitoHorarioMotorista(
        motoristaId,
        horaInicioIda,
        horaFimIda,
        horaInicioVolta,
        horaFimVolta,
        rotaId,
      );

      if (motoristaEmConflitoHorario) {
        return res.status(409).json({
          message: "O motorista já está cadastrado em uma rota neste horário!",
          status: "error",
        });
      }
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Erro ao verificar conflito de motorista!" });
    }

    const vanEmConflito = await Rota.findOne({
      where: {
        van_id: vanId,
        id: { [Op.ne]: rotaId },
        status: 1,
        [Op.or]: [
          {
            hora_inicio_ida: { [Op.lt]: horaFimIda },
            hora_fim_ida: { [Op.gt]: horaInicioIda },
          },
          {
            hora_inicio_volta: { [Op.lt]: horaFimVolta },
            hora_fim_volta: { [Op.gt]: horaInicioVolta },
          },
        ],
      },
    });

    if (vanEmConflito) {
      return res.status(409).json({
        message: "A van já está em uso nesse horário",
        status: "error",
      });
    }

    let escolaEncontrada;

    try {
      escolaEncontrada = await buscarEscola(escolaId);
    } catch (error) {
      console.error(error);
    }

    const dadosRota = {
      nome: `${enderecoBuscado.bairro} - ${escolaEncontrada.nome}`,
      van_id: vanId,
      escola_id: escolaId,
      motorista_id: motoristaId,
      hora_inicio_ida: horaInicioIda,
      hora_fim_ida: horaFimIda,
      hora_inicio_volta: horaInicioVolta,
      hora_fim_volta: horaFimVolta,
      partida_id: enderecoBuscado.id,
    };

    try {
      await Rota.update(dadosRota, {
        where: { id: rotaId },
      });
      return res
        .status(200)
        .json({ message: "Rota atualizada com sucesso!", status: "success" });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Erro ao atualizar a rota!", status: "error" });
    }
  }

  static async excluirRota(req, res) {
    try {
      const { rotaId } = req.params;
      const usuarioId = req.usuario.id;

      const rota = await Rota.findOne({ where: { id: rotaId } });

      if (!rota) {
        return res
          .status(200)
          .json({ message: "Rota não encontrada", status: "error" });
      }

      const rotaComViagem = await Viagem.findOne({
        where: { rota_id: rota.id },
      });

      if (!rotaComViagem) {
        await rota.destroy();
        return res
          .status(200)
          .json({ message: "Rota excluída com sucesso!", status: "success" });
      }

      await rota.update({
        status: 0,
      });

      await RotaAluno.update({ status: 0 }, { where: { rota_id: rotaId } });

      return res
        .status(200)
        .json({ message: "Rota desativada com sucesso!", status: "success" });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Erro ao excluir rota!", status: "error" });
    }
  }

  static async buscarRotaPorTurnoeId(req, res) {
    try {
      const { turno, escolaId } = req.body;

      const whereClause = {};

      if (turno == "Manhã") {
        whereClause.hora_inicio_ida = { [Op.lt]: "12:00" };
      } else if (turno == "Tarde") {
        whereClause.hora_inicio_ida = {
          [Op.gte]: "12:00",
          [Op.lt]: "18:00",
        };
      } else {
        whereClause.hora_inicio_ida = { [Op.gte]: "18:00" };
      }

      const rotas = await RotaEscola.findAll({
        where: { escola_id: escolaId },
        include: [{ model: Rota, as: "rota", where: whereClause }],
      });

      if (rotas.length === 0) {
        return res.status(200).json([]);
      }

      const rotasFlat = rotas.map((rota) => ({
        id: rota.rota.id,
        nome: rota.rota.nome,
        hora_inicio_ida: rota.rota.hora_inicio_ida,
        hora_inicio_volta: rota.rota.hora_inicio_volta,
        hora_fim_volta: rota.rota.hora_fim_volta,
        hora_fim_ida: rota.rota.hora_fim_ida,
      }));

      return res.status(200).json(rotasFlat);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Erro ao buscar rotas!", status: "error" });
    }
  }
}
