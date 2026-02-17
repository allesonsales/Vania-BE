import conn from "../../conn/db.js";
import Motorista from "../../domain/models/Motorista.js";
import Usuario from "../../domain/models//Usuario.js";
import verificarUsuario from "../../domain/utils/usuarios/verificarUsuario.js";
import verificarCampos from "../../domain/utils/verificarCampos.js";
import consultarMotorista from "../../domain/utils/motoristas/consultarMotorista.js";
import verificarIdade from "../../domain/utils/verificarIdade.js";
import Rota from "../../domain/models/Rota.js";
import consultarNumeroDeRotasMotorista from "../../domain/utils/motoristas/consultarNumerodeRotasMotorista.js";
import { Op } from "sequelize";

export class MotoristaController {
  static async cadastrarMotorista(req, res) {
    const transaction = await conn.transaction();
    try {
      const usuarioId = req.usuario.id;
      const {
        nome,
        dataNascimento,
        cpf,
        cnh,
        dataValidadeCnh,
        tipoSanguineo,
        telefone,
        email,
      } = req.body;

      const dadosMotorista = {
        nome: nome,
        data_nascimento: dataNascimento,
        cnh: cnh,
        data_validade_cnh: dataValidadeCnh,
        tipo_sanguineo: tipoSanguineo,
        telefone: telefone,
        usuario_id: usuarioId,
        status: 1,
      };

      const dadosUsuario = {
        nome: nome,
        data_nascimento: dataNascimento,
        cpf: cpf,
        telefone: telefone,
        email: email,
        tipo: 2,
        status: 2,
      };

      const camposObrigatorios = {
        nome,
        dataNascimento,
        cpf,
        telefone,
        email,
      };

      const idade = verificarIdade(dataNascimento);

      if (idade < 18) {
        return res
          .status(409)
          .json({ message: "O motorista deve ser maior de idade!" });
      }

      try {
        verificarCampos(camposObrigatorios);
      } catch (error) {
        console.error(error.message);
        return res.status(400).json({ message: error.message });
      }

      const usuarioEncontrado = await verificarUsuario(cpf, email, telefone);

      if (usuarioEncontrado) {
        if (usuarioEncontrado.cpf === cpf) {
          return res.status(409).json({
            message: "CPF Já cadastrado no sistema!",
            status: "error",
          });
        }

        if (usuarioEncontrado.email === email) {
          return res.status(409).json({
            message: "E-mail Já cadastrado no sistema!",
            status: "error",
          });
        }

        if (usuarioEncontrado.telefone === telefone) {
          return res.status(409).json({
            message: "Telefone Já cadastrado no sistema!",
            status: "error",
          });
        }
      }

      const usuarioMotorista = await Usuario.create(dadosUsuario, {
        transaction,
      });

      dadosMotorista.usuario_motorista_id = usuarioMotorista.id;

      await Motorista.create(dadosMotorista, { transaction });

      await transaction.commit();

      return res.status(200).json({
        message: "Motorista cadastrado com sucesso!",
        status: "success",
      });
    } catch (error) {
      await transaction.rollback();
      console.error(error);
      return res.status(500).json({
        message: "Erro ao cadastrar motorista",
        status: "error",
      });
    }
  }

  static async buscarMotoristas(req, res) {
    try {
      const usuarioId = req.usuario.id;

      const motoristas = await Motorista.findAll({
        where: { usuario_id: usuarioId, status: { [Op.ne]: 0 } },
      });

      return res.status(200).json(motoristas);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Erro ao buscar motoristas...", status: "error" });
    }
  }

  static async buscarMotorista(req, res) {
    try {
      const { motoristaId } = req.params;
      const usuarioId = req.usuario.id;

      const motoristaEncontrado = await consultarMotorista(
        motoristaId,
        usuarioId,
      );

      const usuarioMotorista = await Usuario.findOne({
        where: { id: motoristaEncontrado.usuario_motorista_id },
      });

      if (!motoristaEncontrado) {
        return res
          .status(200)
          .json({ message: "Nenhum motorista encontrado...", status: "erro" });
      }

      const numeroDerotasMotorista =
        await consultarNumeroDeRotasMotorista(motoristaId);

      const motoristaFinal = {
        id: motoristaEncontrado.id,
        nome: motoristaEncontrado.nome,
        cpf: usuarioMotorista.cpf,
        cnh: motoristaEncontrado.cnh,
        data_nascimento: motoristaEncontrado.data_nascimento,
        data_validade_cnh: motoristaEncontrado.data_validade_cnh,
        telefone: motoristaEncontrado.telefone,
        rotasAtivas: numeroDerotasMotorista,
        email: usuarioMotorista.email,
        tipo_sanguineo: motoristaEncontrado.tipo_sanguineo,
      };

      return res.status(200).json(motoristaFinal);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Erro ao buscar motorista...", status: "error" });
    }
  }

  static async editarMotorista(req, res) {
    const transaction = await conn.transaction();
    try {
      const { motoristaId } = req.params;
      const usuarioId = req.usuario.id;

      const motoristaEncontrado = await consultarMotorista(
        motoristaId,
        usuarioId,
      );

      if (!motoristaEncontrado) {
        await transaction.rollback();
        return res
          .status(200)
          .json({ message: "Nenhum motorista encontrado...", status: "erro" });
      }

      const {
        nome,
        dataValidadeCnh,
        dataNascimento,
        cpf,
        email,
        telefone,
        cnh,
        tipoSanguineo,
      } = req.body;

      const dadosMotorista = {
        nome: nome,
        data_validade_cnh: dataValidadeCnh,
        data_nascimento: dataNascimento,
        cpf: cpf,
        email: email,
        telefone: telefone,
        cnh: cnh,
        tipo_sanguineo: tipoSanguineo,
      };

      const dadosUsuario = {
        nome: nome,
        cpf: cpf,
        telefone: telefone,
        email: email,
      };

      const idade = verificarIdade(dataNascimento);

      if (idade < 18) {
        return res.status(409).json({
          message: "O motorista deve ser maior de idade!",
          status: "error",
        });
      }

      const usuarioEncontrado = await verificarUsuario(cpf, email, telefone);

      if (
        usuarioEncontrado &&
        usuarioEncontrado.id !== motoristaEncontrado.usuario_motorista_id
      ) {
        console.log("Entramos aqui");
        if (usuarioEncontrado.cpf === cpf) {
          return res
            .status(409)
            .json({ message: "Esse CPF já está cadastrado!", status: "error" });
        }

        if (usuarioEncontrado.email === email) {
          return res.status(409).json({
            message: "Esse E-mail já está cadastrado!",
            status: "error",
          });
        }
        if (usuarioEncontrado.telefone === telefone) {
          return res.status(409).json({
            message: "Esse telefone já está cadastrado!",
            status: "error",
          });
        }
      }

      await motoristaEncontrado.update(dadosMotorista, { transaction });
      await Usuario.update(dadosUsuario, {
        where: { id: motoristaEncontrado.usuario_motorista_id },
        transaction,
      });

      await transaction.commit();

      return res.status(200).json({
        message: "Motorista atualizado com sucesso!",
        status: "success",
      });
    } catch (error) {
      await transaction.rollback();
      console.error(error);
      return res
        .status(500)
        .json({ message: "Erro ao atualizar motorista!", status: "error" });
    }
  }

  static async excluirMotorista(req, res) {
    try {
      const { motoristaId } = req.params;
      const usuarioId = req.usuario.id;

      const motoristaEncontrado = await consultarMotorista(
        motoristaId,
        usuarioId,
      );

      if (!motoristaEncontrado) {
        return res.status(500).json({ message: "Motorista nao encontrado!" });
      }

      const motoristaEmRotaAtiva = await Rota.findOne({
        where: {
          motorista_id: motoristaId,
          status: 1,
        },
      });

      if (motoristaEmRotaAtiva) {
        return res.status(400).json({
          message:
            "Não foi possível excluir o motorista. Existem rotas ativas associadas a ela.",
          status: "error",
        });
      }

      const motoristaEmRotaInativa = await Rota.findOne({
        where: {
          motorista_id: motoristaId,
          status: 0,
        },
      });

      if (motoristaEmRotaInativa) {
        await motoristaEncontrado.update({ status: 0 });
        return res.status(200).json({
          message: "Motorista desativado com sucesso.",
          status: "success",
        });
      }

      await motoristaEncontrado.destroy();

      return res.status(200).json({
        message: "Motorista excluído com sucesso!",
        status: "success",
      });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Erro ao excluir motorista!", status: "error" });
    }
  }
}
