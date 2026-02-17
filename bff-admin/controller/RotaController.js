import { Op, where } from "sequelize";
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

export class RotaController {
  static async cadastrarRota(req, res) {
    try {
      const usuarioId = req.usuario.id;
      const {
        vanId,
        motoristaId,
        escolaId,
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

      const camposObrigatorios = {
        vanId,
        motoristaId,
        escolaId,
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
        return res.status(400).json({ message: "Erro ao verificar endereço!" });
      }

      let escola = await buscarEscola(escolaId);

      const dadosRota = {
        nome: `${enderecoBuscado.bairro} - ${escola.nome}`,
        van_id: vanId,
        escola_id: escolaId,
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
          escola_id: escolaId,
          motorista_id: motorista.id,
          partida_id: enderecoBuscado.id,
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

      await Rota.create(dadosRota);

      console.log("Rota cadastrada!");
      return res
        .status(201)
        .json({ message: "Rota cadastrada com sucesso!", status: "success" });
    } catch (error) {
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

      try {
        rotas = await consultarRotas(usuarioId);
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
        return res.status(200).json({ message: "Rota não encontrada" });
      }

      return res.status(200).json(rota);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erro ao buscar rota!" });
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

      const rota = await consultarRota(rotaId, usuarioId);

      if (!rota) {
        return res
          .status(200)
          .json({ message: "Rota não encontrada", status: "error" });
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
        .json({ message: "Erro ao buscar rota!", status: "error" });
    }
  }

  static async buscarRotaPorTurnoeId(req, res) {
    try {
      const { turno, escolaId } = req.body;

      let where = {
        escola_id: escolaId,
        status: 1,
      };

      if (escolaId) {
        where.escola_id = escolaId;
      }

      if (turno == "Manhã") {
        where.hora_inicio_ida = { [Op.lt]: "12:00" };
      } else if (turno == "Tarde") {
        where.hora_inicio_ida = {
          [Op.gte]: "12:00",
          [Op.lt]: "18:00",
        };
      } else {
        where.hora_inicio_ida = { [Op.gte]: "18:00" };
      }

      const rotas = await Rota.findAll({ where });

      if (rotas.length === 0) {
        return res.status(200).json([]);
      }

      return res.status(200).json(rotas);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Erro ao buscar rotas!", status: "error" });
    }
  }
}
